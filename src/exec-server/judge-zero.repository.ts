import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { judgeConfig } from './configuration/judge-zero-server.conf';
import { JudgeZeroSubmissionDTO } from './dto/judge-zero-submission.dto';
import axios from 'axios';
import { Language } from 'src/languages/language.schema';
import { godboxConfig } from './configuration/godbox.conf';

const languages = {
  'c++': 50,
  rust: 73,
  python: 71,
  bash: 46,
};

@Injectable()
export class JudgeZeroRepository {
  async execute(
    code: string,
    language: Language,
  ): Promise<JudgeZeroSubmissionDTO> {
    const res = await axios.post(
      `${godboxConfig.baseUrl}/submissions`,
      {
        language_id: languages[language.name],
        source_code: code,
      },
      {
        params: { base64_encoded: false, wait: true },
      },
    );

    switch (res.status) {
      case 201:
        return res.data as JudgeZeroSubmissionDTO;
      case 422:
        throw new UnprocessableEntityException(res.statusText);
      default:
        throw new InternalServerErrorException('Failed executing code.');
    }
  }

  async get(token: string): Promise<JudgeZeroSubmissionDTO> {
    const res = await axios.get(`${judgeConfig.baseUrl}/submissions/${token}`);

    switch (res.status) {
      case 200:
        return res.data as JudgeZeroSubmissionDTO;
      case 422:
        throw new UnprocessableEntityException(res.statusText);
      default:
        throw new InternalServerErrorException('Failed executing code.');
    }
  }
}
