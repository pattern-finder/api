import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Language } from 'src/attempt/attempt.schema';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import { promises as fs, createWriteStream } from 'fs';
import * as archiver from 'archiver';

const TEMP_DIR = '/temp';

@Injectable()
export class GodBoxRepository {
  async fetchImagesBuffers(pictures: PictureUrlDTO[]): Promise<Buffer[]> {
    return (
      await Promise.all(
        pictures.map((pic) =>
          axios.request({
            responseType: 'arraybuffer',
            url: pic.url,
            method: 'get',
          }),
        ),
      )
    ).map((result) => result.data);
  }

  async extractZipFileBase64(archivePath: string): Promise<string> {
    return (await fs.readFile(archivePath)).toString('base64');
  }

  /*
   * Create a directory, download the pictures and code files in it, and hand back the base64 for the zip.
   */
  async bundleExec(pictures: PictureUrlDTO[], code: string): Promise<string> {
    const fullTempDir = `${TEMP_DIR}/${randomUUID()}`;

    fs.mkdir(fullTempDir, { recursive: true }).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });

    const archivePath = fullTempDir + '/exec_bundle.zip';

    const output = createWriteStream(archivePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      } else {
        throw new InternalServerErrorException(err);
      }
    });

    archive.on('error', function (err) {
      throw new InternalServerErrorException(err);
    });

    archive.pipe(output);

    (await this.fetchImagesBuffers(pictures)).forEach((picture, index) => {
      archive.append(picture, { name: `pictures/picture-${index}` });
    });

    archive.append(code, { name: 'main.c' });

    await new Promise<void>((resolve) => {
      output.on('close', () => {
        resolve();
      });
      return archive.finalize();
    });

    archive.unpipe();
    const res = this.extractZipFileBase64(archivePath);

    fs.rmdir(fullTempDir, { recursive: true }).catch((err) => {
      throw new InternalServerErrorException(err);
    });

    return res;
  }

  async execute(
    code: string,
    language: Language,
    pictures: PictureUrlDTO[],
  ): Promise<GodboxPhaseOutputDTO> {
    const payload = {
      phases: [
        {
          name: 'Compilation',
          script: '/usr/local/gcc-11.1.0/bin/gcc main.c -o out',
        },
        {
          name: 'Execution',
          script: './out',
        },
      ],
      files: await this.bundleExec(pictures, code),
    };

    try {
      const { data }: { data: { phases: GodboxPhaseOutputDTO[] } } =
        await axios.post(`${godboxConfig.baseUrl}/run`, payload);

      return data.phases.find((phase) => phase.name === 'Execution');
    } catch (err) {
      throw new InternalServerErrorException(
        err?.response?.data?.message || err?.message || 'Unkown reason.',
      );
    }
  }
}
