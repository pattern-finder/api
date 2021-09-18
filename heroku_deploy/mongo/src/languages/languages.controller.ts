import { Controller, Get, Post } from '@nestjs/common';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { LanguagesCommand } from 'src/seed/languages.command';
import {
  SanitizedLanguageDTO,
  sanitizedLanguageTemplate,
} from './dto/sanitized-language.dto';
import { LanguagesService } from './languages.service';

@Controller('/languages')
export class LanguagesController {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly languagesCommand: LanguagesCommand,
  ) {}

  @Get()
  async getLanguages(): Promise<SanitizedLanguageDTO[]> {
    return (await this.languagesService.findAll()).map((language) =>
      sanitize<SanitizedLanguageDTO>(language, sanitizedLanguageTemplate),
    );
  }

  @Post('/seed')
  async seedLanguages(): Promise<void> {
    this.languagesCommand.create();
  }
}
