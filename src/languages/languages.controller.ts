import { Controller, Get } from '@nestjs/common';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import {
  SanitizedLanguageDTO,
  sanitizedLanguageTemplate,
} from './dto/sanitized-language.dto';
import { LanguagesService } from './languages.service';

@Controller('/languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  async getLanguages(): Promise<SanitizedLanguageDTO[]> {
    return (await this.languagesService.findAll()).map((language) =>
      sanitize<SanitizedLanguageDTO>(language, sanitizedLanguageTemplate),
    );
  }
}
