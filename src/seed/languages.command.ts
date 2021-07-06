import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { LanguagesService } from 'src/languages/languages.service';

@Injectable()
export class LanguagesCommand {
  constructor(private readonly languageService: LanguagesService) {}

  private readonly languages = [
    {
      name: 'c++',
      phases: [
        {
          name: 'Compilation',
          script: '/usr/local/gcc-11.1.0/bin/g++ main.cpp -o out',
        },
        {
          name: 'Execution',
          script: './out',
        },
      ],
      mainFileName: 'main.cpp',
    },
    {
      name: 'python',
      phases: [
        {
          name: 'Execution',
          script: 'python3 main.py',
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
