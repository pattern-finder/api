import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { Language } from 'src/attempt/attempt.schema';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { godboxConfig } from './configuration/godbox.conf';
import { GodboxPhaseOutputDTO } from './dto/godbox-phase-output.dto';
import { promises as fs } from 'fs';
import * as AdmZip from 'adm-zip';
import {
  CPP_PHASES,
  PhaseEntity,
  PYTHON_PHASES,
  RUST_PHASES,
} from './languages-phases';

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
  async bundleExec(
    pictures: PictureUrlDTO[],
    code: string,
    language: Language,
  ) {
    const zip = new AdmZip();

    this.addCodeFiles(zip, language, code);

    const imageBuffers = await this.fetchImagesBuffers(pictures);
    // later add some format extension or something
    imageBuffers.map((image, index) => {
      zip.addFile(`pictures/picture-${index}`, image);
    });

    return zip.toBuffer().toString('base64');
  }

  addCodeFiles(zip: AdmZip, language: Language, code: string) {
    switch (language) {
      case Language.PYTHON:
        zip.addFile('main.py', Buffer.from(code));
        return;
      case Language.CPP:
        zip.addFile('main.cpp', Buffer.from(code));
        return;
      case Language.RUST:
        zip.addFile('main.rs', Buffer.from(code));
        return;
      default:
        throw new UnprocessableEntityException('Invalid language given.');
    }
  }

  async execute(
    code: string,
    language: Language,
    pictures: PictureUrlDTO[],
  ): Promise<GodboxPhaseOutputDTO> {
    const payload = {
      phases: this.getPhases(language),
      files: await this.bundleExec(pictures, code, language),
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

  getPhases(language: Language): PhaseEntity[] {
    switch (language) {
      case Language.PYTHON:
        return PYTHON_PHASES;
      case Language.CPP:
        return CPP_PHASES;
      case Language.RUST:
        return RUST_PHASES;
      default:
        throw new UnprocessableEntityException('Invalid language given.');
    }
  }
}
