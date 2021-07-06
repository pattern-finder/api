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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { ParameterizedLinkifier } from 'src/common/responses/parametrized-linkify.interceptor';
import { Challenge } from './challenge.schema';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import {
  DetailedChallengeDTO,
  detailedChallengeTemplate,
} from './dto/detailed-challenge.dto';
import {
  ListChallengeDTO,
  listChallengeTemplate,
} from './dto/list-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@UseInterceptors(
  ParameterizedLinkifier([
    {
      attribute: 'owner',
      resource: 'users',
    },
  ]),
)
@Controller('/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get(':id')
  async getChallenge(
    @Param() findByIdDTO: FindByIdDTO,
  ): Promise<DetailedChallengeDTO> {
    const challenge = await this.challengesService.findOne(findByIdDTO);
    if (!challenge) {
      throw new NotFoundException(
        'Challenge with specified ID does not exist.',
      );
    }
    return sanitize<DetailedChallengeDTO>(challenge, detailedChallengeTemplate);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('pictures'))
  @Post()
  async createChallenge(
    @Request() req: { user: SessionUserDTO },
    @Body() challengeDTO: CreateChallengeDTO,
    @UploadedFiles() pictures: Array<BufferedFile>,
  ): Promise<Challenge> {
    if (!pictures || pictures.length < 1) {
      throw new BadRequestException(
        'Please provide pictures for this challenge.',
      );
    } else if (pictures.length > 10) {
      throw new BadRequestException(
        'You can only upload a maximum of 10 pictures.',
      );
    }
    return this.challengesService.create(
      {
        ...challengeDTO,
        owner: req.user.userId,
      },
      pictures,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateChallenge(@Body() updateChallengeDTO: UpdateChallengeDTO) {
    return this.challengesService.update(updateChallengeDTO);
  }

  @Get()
  async getChallenges(): Promise<ListChallengeDTO[]> {
    return (await this.challengesService.findAll()).map((challenge) =>
      sanitize<ListChallengeDTO>(challenge, listChallengeTemplate),
    );
  }
}
