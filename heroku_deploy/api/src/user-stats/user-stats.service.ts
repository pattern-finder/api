import { Injectable } from '@nestjs/common';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { AttemptsService } from 'src/attempts/attempts.service';
import { ChallengesService } from 'src/challenges/challenges.service';
import { SeriesService } from 'src/series/series.service';
import { UserDefaultSeriesStatsDTO } from './dto/user-default-series-stats.dto';
import { ChallengeStatsDTO } from './dto/challenge-stats.dto';
import { SerieStatsDTO } from './dto/serie-stats.dto';
import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
import { generalStatsDTO } from './dto/general-stats.dto';

@Injectable()
export class UserStatsService {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly challengesService: ChallengesService,
    private readonly seriesService: SeriesService,
    private readonly execBootstrapService: ExecBootstrapsService,
  ) {}

  async getCompletion(
    userIdDTO: FindByIdDTO,
  ): Promise<UserDefaultSeriesStatsDTO> {
    const defaultSeries = await this.seriesService.findDefaultSeries();


    const attemptsToStats = async (
      challengeId: string,
      userId: string,
    ): Promise<ChallengeStatsDTO> => {
      const challenge = await this.challengesService.findOne({
        id: challengeId,
      });

      const attempts =
        await this.attemptsService.findValidatedByUserAndChallenge(
          userId,
          challengeId,
        );

        console.log("challenge")
        console.log(challenge)

        console.log("attempts")
        console.log(attempts)

      let bestTime: number;
      if (attempts.length > 0) {
        bestTime = attempts.reduce((prev, next) =>
          prev.time < next.time ? prev : next,
        ).time;
      } else {
        bestTime = -1;
      }

      return {
        _id: challengeId,
        name: challenge.name,
        completed: attempts.length > 0,
        bestTime: bestTime,
      };
    };

    const seriesWithChallenges = await Promise.all(
      defaultSeries.map((serie): Promise<SerieStatsDTO> => {
        const composeStats = async () => {
          return {
            _id: serie._id,
            name: serie.name,
            challenges: await Promise.all(
              serie.challenges.map((challenge) => {
                return attemptsToStats(challenge, userIdDTO.id);
              }),
            ),
          };
        };
        return composeStats();
      }),
    );

    return {
      series: await seriesWithChallenges,
    };
  }

  async getExecStats(userIdobject: FindByIdDTO): Promise<generalStatsDTO> {
    const attempts = await this.attemptsService.findByUser(userIdobject);

    const nbExecs = attempts.length;

    const nbSucessfullExecs = attempts.filter((a) => a.status === 0).length;
    const successRatio = nbSucessfullExecs / attempts.length;

    const challengesObject = {};

    await Promise.all(
      attempts.map((a) => {
        const getStats = async () => {
          const bootstrap = await this.execBootstrapService.findOne({
            id: a.execBootstrap,
          });
          challengesObject[bootstrap.challenge] =
            challengesObject[bootstrap.challenge] || a.status === 0;
        };
        return getStats();
      }),
    );
    console.log(challengesObject);
    const nbValidatedChallenges = Object.keys(challengesObject).filter(
      (k) => challengesObject[k],
    ).length;
    const nbParticipatedChallegnes = Object.keys(challengesObject).length;
    return {
      nbExecs,
      nbParticipatedChallegnes,
      nbSucessfullExecs,
      nbValidatedChallenges,
      successRatio,
    };
  }
}
