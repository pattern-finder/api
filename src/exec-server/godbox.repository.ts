import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import { promises as fs } from 'fs';
import * as AdmZip from 'adm-zip';
import { ExecBootstrap } from 'src/exec-bootstrap/exec-bootstrap.schema';
import { LanguagesService } from 'src/languages/languages.service';
import { ChallengesService } from 'src/challenges/challenges.service';
import { Language } from 'src/languages/language.schema';

const LIBS_DIR = process.env.LIBS_DIR || '/usr/src/app/libs';
@Injectable()
export class GodBoxRepository {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly challengeService: ChallengesService,
  ) {}

  async fetchImagesBuffers(bootstrap: ExecBootstrap): Promise<Buffer[]> {
    const pictures = (
      await this.challengeService.findOne({ id: bootstrap.challenge }, true)
    ).pictures;
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
    code: string,
    language: Language,
    bootstrap: ExecBootstrap,
  ) {
    const zip = new AdmZip();

    zip.addLocalFolder(`${LIBS_DIR}/${language.name}`, 'lib');

    if (language.name === 'cpp') {
      zip.addLocalFile('/usr/src/app/conf/CMakeLists.txt');
    }
    zip.addFile(language.mainFileName, Buffer.from(code));

    const imageBuffers = await this.fetchImagesBuffers(bootstrap);
    // later add some format extension or something
    imageBuffers.map((image, index) => {
      zip.addFile(`pictures/picture-${index}`, image);
    });

    return zip.toBuffer().toString('base64');
  }

  async execute(
    code: string,
    bootstrap: ExecBootstrap,
  ): Promise<GodboxPhaseOutputDTO> {
    const language = await this.languagesService.findByName(bootstrap.language);

    const completeCode = `${bootstrap.tests}\n${code}`;
    const payload = {
      phases: language.phases,
      files: await this.bundleExec(completeCode, language, bootstrap),
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
