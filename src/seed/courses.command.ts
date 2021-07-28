import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
import { SeriesService } from 'src/series/series.service';
import { UsersService } from 'src/users/users.service';

export const DEFAULT_SERIE_NAME = 'Picspy Courses';
@Injectable()
export class CoursesCommand {
  constructor(
    private readonly challengeService: ChallengesService,
    private readonly execBootstrapService: ExecBootstrapsService,
    private readonly seriesService: SeriesService,
    private readonly userService: UsersService,
  ) {}

  private readonly user = {
    username: 'picspy',
    password: '',
    email: 'support@picspy.com',
  };

  private readonly serie = {
    name: 'DEFAULT SERIE',
  };

  private readonly challenges = [
    {
      name: 'challenge 1',

      instructions: 'blblblblbl',
    },

    {
      name: 'challenge 2',

      instructions: 'blblblblbl',
    },

    {
      name: 'challenge 3',

      instructions: 'blblblblbl',
    },
  ];

  private readonly exebootstrap = {
    language: 'cpp',

    tests: `
    #include <iostream>

    // USER_CODE


    int main() {
        function();
        return 0;
    }
    `,
    functionTemplate: `
    void function() {
      //code 
      
      }
      `,
  };

  @Command({
    command: 'seed:courses',
    describe: 'Fill courses with default challenges in database',
    autoExit: true,
  })
  async create() {
    await Promise.all(
      this.challenges.map((c) => {
        const deleteChallenge = async (): Promise<void> => {
          const existing = await this.challengeService.findByName(c.name);

          if (existing) {
            await this.challengeService.delete({ id: existing._id });
          }
        };

        return deleteChallenge();
      }),
    );

    const existingSerie = await this.seriesService.findByName(this.serie.name);

    if (existingSerie) {
      await this.seriesService.delete(existingSerie._id);
    }

    const existingUser = await this.userService.findByUsername(
      this.user.username,
    );

    if (existingUser) {
      await this.userService.delete(existingUser._id);
    }

    const createdUser = await this.userService.create({
      ...this.user,
    });

    const serie = await this.seriesService.create({
      name: this.serie.name,
      owner: createdUser._id.toString(),
      isCourse: true,
    });

    const challenges = await Promise.all(
      this.challenges.map((c) => {
        return this.challengeService.create(
          {
            instructions: c.instructions,
            name: c.name,
            owner: createdUser._id.toString(),
            isCourse: true,
          },
          [],
        );
      }),
    );

    await Promise.all(
      challenges.map((c) => {
        return this.execBootstrapService.create({
          ...this.exebootstrap,
          challenge: c._id.toString(),
        });
      }),
    );

    await this.seriesService.update(serie._id, {
      challenges: challenges.map((c) => c._id),
    });
  }
}
