import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Language } from 'src/attempt/attempt.schema';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import { promises as fs } from 'fs';
import * as AdmZip from 'adm-zip';

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
    console.log('readfile');
    return (await fs.readFile(archivePath)).toString('base64');
  }

  /*
   * Create a directory, download the pictures and code files in it, and hand back the base64 for the zip.
   */
  async bundleExec(pictures: PictureUrlDTO[], code: string) {
    const zip = new AdmZip();

    zip.addFile('main.c', Buffer.from(code));

    const imageBuffers = await this.fetchImagesBuffers(pictures);
    // later add some format extension or something
    imageBuffers.map((image, index) => {
      zip.addFile(`pictures/picture-${index}`, image);
    });

    return zip.toBuffer().toString('base64');
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
