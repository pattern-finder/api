import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { LanguagesService } from 'src/languages/languages.service';
@Injectable()
export class LanguagesCommand {
  constructor(private readonly languageService: LanguagesService) {}

  private readonly languages = [
    {
      name: 'cpp',
      phases: [
        {
          name: 'Compilation',
          script: `cmake . && cmake --build .`,
        },
        {
          name: 'Execution',
          script: './picspy-attempt',
        },
      ],
      mainFileName: 'main.cpp',
    },
    {
      name: 'python',
      phases: [
        {
          name: 'Execution',
          script: '/usr/local/python-3.9.6/bin/python3.9 main.py',
        },
      ],
      mainFileName: 'main.py',
    },
    {
      name: 'rust',
      phases: [
        {
          name: 'Compilation',
          script: '/usr/local/rust-1.52.0/bin/rustc main.rs',
        },
        {
          name: 'Execution',
          script: './main',
        },
      ],
      mainFileName: 'main.rs',
    },
  ];

  @Command({
    command: 'seed:languages',
    describe: 'Fill languages in database',
    autoExit: true,
  })
  async create() {
    await this.languageService.deleteAll();
    await Promise.all(
      this.languages.map(
        async (language) => await this.languageService.create(language),
      ),
    );
  }
}
