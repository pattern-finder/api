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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChallengesService } from 'src/challenges/challenges.service';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { LinkifyInterceptor } from 'src/common/responses/linkify.interceptor';
import { SanitizedUserDTO } from 'src/users/dto/sanitized-user.dto';
import { CreateSerieDTO } from './dtos/create-serie.dto';
import {
  SanitizedSerieDTO,
  sanitizedSerieTemplate,
} from './dtos/sanitized-serie.dto';
import { UpdateSerieDTO } from './dtos/update-serie.dto';
import { Serie } from './series.schema';
import { SeriesService } from './series.service';

@UseInterceptors(LinkifyInterceptor)
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
  async createSerie(@Body() serieDTO: CreateSerieDTO): Promise<Serie> {
    return await this.seriesService.create(serieDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateSerie(
    @Request() req: { user: SessionUserDTO },
    @Body() updateSerieDTO: UpdateSerieDTO,
  ): Promise<Serie> {
    if (Object.keys(updateSerieDTO).length === 1) {
      throw new BadRequestException('No changes were specified.');
    }

    updateSerieDTO?.challenges.forEach((challengeIdObject) => {
      if (!this.challengesService.findOne(challengeIdObject._id)) {
        throw new BadRequestException(
          `Challenge with id ${challengeIdObject._id} does not exist.`,
        );
      }
    });

    const serie = this.seriesService.update(updateSerieDTO._id, updateSerieDTO);

    return serie;
  }
}
