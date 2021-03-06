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
const ALGO_DIR = process.env.ALGO_DIR || '/usr/src/app/evaluation_code';

@Injectable()
export class GodBoxRepository {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly challengeService: ChallengesService,
  ) {}

  async fetchImagesBuffers(
    bootstrap: ExecBootstrap,
  ): Promise<{ filename: string; buffer: Buffer }[]> {
    const pictures = (
      await this.challengeService.findOne({ id: bootstrap.challenge }, true)
    ).pictures;
    return await Promise.all(
      pictures.map((pic) => {
        const fetchPicture = async () => {
          return {
            buffer: (
              await axios.request({
                responseType: 'arraybuffer',
                url: pic.file,
                method: 'get',
              })
            ).data,
            filename: pic.execFileName,
          };
        };
        return fetchPicture();
      }),
    );
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
    zip.addFile(`main${language.extension}`, Buffer.from(code));

    const imageBuffers = await this.fetchImagesBuffers(bootstrap);
    // later add some format extension or something
    imageBuffers.map((image, index) => {
      zip.addFile(
        `pictures/${image.filename || `picture-${index}`}`,
        image.buffer,
      );
    });

    return zip.toBuffer().toString('base64');
  }



  private async bundleExecEvaluationCode(
    code: string,
    language: Language
  ) {
    const zip = new AdmZip();

    const exec_algo = 
    "from evaluation_code.evalNbLigneFonction import excecEvalNbLigneFonction \n"+
    "from evaluation_code.evalCommentaire import excecEvalCommentaire \n"+
    "from evaluation_code.evalRedondance import excecEvalRedondance \n"+
    "from evaluation_code.evalVariableName import excecEvalVariableName \n"+
    "from evaluation_code.evalPlagiat import excecEvalPlagiat \n"+
    "if __name__ == '__main__': \n"+
    "    import os \n"+
    "    import re \n"+
    "    filin = open(\"userCode.py\", \"r\") \n"+
    "    lignes = filin.readlines()\n"+   
    "    new_lignes = []\n"+  
    "    for ligne in lignes:\n"+     
    "       ligne.replace(\"\\n\", \"\")\n"+    
    "       new_lignes.append(ligne)\n"+   
    "    lignes  =  new_lignes\n"+  
    "    payload = { \n"+
    "        \"eval_variable_name\":excecEvalVariableName(lignes), \n"+
    "        \"eval_redondance\": excecEvalRedondance(lignes), \n"+
    "        \"eval_nb ligne_fonction\": excecEvalNbLigneFonction(lignes), \n"+
    "        \"eval_commentaire\": excecEvalCommentaire(lignes), \n"+
    "        \"eval_plagiat\": excecEvalPlagiat(lignes) \n"+

    "    } \n"+
    "    filin.close() \n"+
    "    print(payload) \n"


    zip.addLocalFolder(`${ALGO_DIR}/${language.name}`, 'evaluation_code');
    zip.addFile(`userCode.py`, Buffer.from(code));
    zip.addFile(`main.py`, Buffer.from(exec_algo));


    return zip.toBuffer().toString('base64');
  }



  formatPhasesResults(phases: GodboxPhaseOutputDTO[]): GodboxPhaseOutputDTO {
    const res = phases[phases.length - 1];
    return {
      ...res,
      status: res.name === 'Execution' ? res.status : -1,
    };
  }

  async execute(
    code: string,
    bootstrap: ExecBootstrap,
  ): Promise<GodboxPhaseOutputDTO> {
    const language = await this.languagesService.findByName(bootstrap.language);

    const completeCode = bootstrap.tests.includes('// USER_CODE')
      ? bootstrap.tests.replace('// USER_CODE', code)
      : `${bootstrap.tests}\n${code}`;

    const payload = {
      phases: language.phases,
      files: await this.bundleExec(completeCode, language, bootstrap),
    };

    try {
      const { data }: { data: { phases: GodboxPhaseOutputDTO[] } } =
        await axios.post(`${godboxConfig.baseUrl}/run`, payload);
      return this.formatPhasesResults(data.phases);
    } catch (err) {
      throw new InternalServerErrorException(
        err?.response?.data?.message || err?.message || 'Unkown reason.',
      );
    }
  }


  async executeAlgoEvaluation(
    code: string,
    bootstrap: ExecBootstrap,
  ): Promise<GodboxPhaseOutputDTO> {
    const language = await this.languagesService.findByName("python");


    const payload = {
      phases: language.phases,
      files: await this.bundleExecEvaluationCode(code, language),
    };


    try {
      const { data }: { data: { phases: GodboxPhaseOutputDTO[] } } =
        await axios.post(`${godboxConfig.baseUrl}/run`, payload);
      return this.formatPhasesResults(data.phases);
    } catch (err) {
      throw new InternalServerErrorException(
        err?.response?.data?.message || err?.message || 'Unkown reason.',
      );
    }
  }


}
