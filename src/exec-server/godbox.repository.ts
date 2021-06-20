import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Language } from 'src/attempt/attempt.schema';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import * as fs from 'fs';
import archiver from 'archiver';

const TEMP_DIR = '/temp';

@Injectable()
export class GodBoxRepository {
  /*
   * Create a directory, download the pictures and code files in it, and hand back the base64 for the zip.
   *
   *
   */
  async createZipBase64(
    pictures: PictureUrlDTO[],
    code: string,
  ): Promise<string> {
    const fullTempDir = `${TEMP_DIR}/${randomUUID()}`;

    const archivePath = fullTempDir + '/exec_bundle.zip';

    const buffers = (
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

    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      } else {
        throw err;
      }
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(output);

    buffers.forEach((picture, index) => {
      archive.append(picture, { name: `pictures/picture-${index}` });
    });

    archive.append(code, { name: 'main.c' });

    await archive.finalize();

    const archive_buffer = fs.readFileSync(archivePath);

    // decode buffer as Base64
    const res = archive_buffer.toString('base64');

    fs.rmSync(archivePath);

    return res;
  }

  async execute(
    code: string,
    language: Language,
    pictures: PictureUrlDTO[],
  ): Promise<GodboxPhaseOutputDTO> {
    const { data }: { data: GodboxPhaseOutputDTO[] } = await axios.post(
      `${godboxConfig.baseUrl}/run`,
      {
        phases: [
          {
            name: 'Compilation',
            script: '/usr/local/gcc-11.1.0/bin/gcc src/main.c -o out',
          },
          {
            name: 'Execution',
            script: './out',
          },
        ],
        files: this.createZipBase64(pictures, code),
      },
    );

    return data.filter((phase) => phase.name == 'Execution')[0];
  }
}
