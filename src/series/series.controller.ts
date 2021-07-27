import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Challenge } from 'src/challenges/challenge.schema';
import { ChallengesService } from 'src/challenges/challenges.service';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { CreateSerieDTO } from './dtos/create-serie.dto';
import {
  SanitizedSerieDTO,
  sanitizedSerieTemplate,
} from './dtos/sanitized-serie.dto';
import { UpdateSerieDTO } from './dtos/update-serie.dto';
import { Serie } from './series.schema';
import { SeriesService } from './series.service';
import * as _ from 'lodash';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly challengesService: ChallengesService,
  ) {}

  @Get(':id')
  async getSerie(@Param() idObject: FindByIdDTO): Promise<SanitizedSerieDTO> {
    const series = await this.seriesService.findOne(idObject.id);

    if (!series) {
      throw new NotFoundException('Serie with specified ID does not exist.');
    }

    return sanitize<SanitizedSerieDTO>(series, sanitizedSerieTemplate);
  }

  @Get()
  async getSeries(): Promise<SanitizedSerieDTO[]> {
    const series = (await this.seriesService.findAll()).map((serie) =>
      sanitize<SanitizedSerieDTO>(serie, sanitizedSerieTemplate),
    );

    return series;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSerie(
    @Request() req: { user: SessionUserDTO },
    @Body() serieDTO: CreateSerieDTO,
  ): Promise<Serie> {
    return await this.seriesService.create(serieDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateSerie(
    @Request() req: { user: SessionUserDTO },
    @Body() updateSerieDTO: UpdateSerieDTO,
  ) {
    if (Object.keys(updateSerieDTO).length === 1) {
      throw new BadRequestException('No changes were specified.');
    }

    if (!(await this.seriesService.findOne(updateSerieDTO._id))) {
      throw new UnprocessableEntityException(
        `Serie with id ${updateSerieDTO._id} does not exist.`,
      );
    }

    const challenges: Challenge[] = [];

    for (let i = 0; i < (updateSerieDTO.challenges || []).length; ++i) {
      const challenge = await this.challengesService.findOne({
        id: updateSerieDTO.challenges[i]._id,
      });

      if (!challenge) {
        throw new UnprocessableEntityException(
          `Challenge with id ${updateSerieDTO.challenges[i]._id} does not exist.`,
        );
      } else {
        challenges.push(challenge);
      }
    }

    // This removes the attribute challenge if it is undefined, so that it's not updated in the query.
    const populatedSerie = _.pickBy(
      {
        ...updateSerieDTO,
        challenges: challenges.length > 0 ? challenges : undefined,
      },
      _.identity,
    );

    const serie = this.seriesService.update(updateSerieDTO._id, populatedSerie);

    return serie;
  }
}
