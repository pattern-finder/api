import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import { promises as fs } from 'fs';
import * as AdmZip from 'adm-zip';
import { Language } from 'src/languages/language.schema';
import { ExecBootstrap } from 'src/exec-bootstrap/exec-bootstrap.schema';
import { LanguagesService } from 'src/languages/languages.service';

@Injectable()
export class GodBoxRepository {
  constructor(private readonly languagesService: LanguagesService) {}

  async fetchImagesBuffers(pictures: PictureUrlDTO[]): Promise<Buffer[]> {
    return (
      await Promise.all(
        pictures.map((pic) =>
          axios.request({
            responseType: 'arraybuffer',
            url: pic.file,
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
  private async bundleExec(
    pictures: PictureUrlDTO[],
    code: string,
    language: Language,
  ) {
    const zip = new AdmZip();

    zip.addFile(language.mainFileName, Buffer.from(code));

    const imageBuffers = await this.fetchImagesBuffers(pictures);
    // later add some format extension or something
    imageBuffers.map((image, index) => {
      zip.addFile(`pictures/picture-${index}`, image);
    });

    return zip.toBuffer().toString('base64');
  }

  async execute(
    code: string,
    bootstrap: ExecBootstrap,
    pictures: PictureUrlDTO[],
  ): Promise<GodboxPhaseOutputDTO> {
    const language = await this.languagesService.findByName(bootstrap.language);

    const completeCode = `${bootstrap.tests}\n${code}`;
    const payload = {
      phases: language.phases,
      files: await this.bundleExec(pictures, completeCode, language),
    };

    try {
      const { data }: { data: { phases: GodboxPhaseOutputDTO[] } } =
        await axios.post(`${godboxConfig.baseUrl}/run`, payload);
      return data.phases[data.phases.length - 1];
    } catch (err) {
      throw new InternalServerErrorException(
        err?.response?.data?.message || err?.message || 'Unkown reason.',
      );
    }
  }
}
