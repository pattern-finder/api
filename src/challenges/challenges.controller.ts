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
import { LinkifyInterceptor } from 'src/common/responses/linkify.interceptor';
import { Challenge } from './challenge.schema';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import {
  SanitizedChallengeDTO,
  sanitizedChallengeTemplate,
} from './dto/sanitized-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@UseInterceptors(LinkifyInterceptor)
@Controller('/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get(':id')
  async getChallenge(
    @Param() findByIdDTO: FindByIdDTO,
  ): Promise<SanitizedChallengeDTO> {
    const challenge = await this.challengesService.findOne(findByIdDTO.id);
    if (!challenge) {
      throw new NotFoundException(
        'Challenge with specified ID does not exist.',
      );
    }
    return sanitize<SanitizedChallengeDTO>(
      challenge,
      sanitizedChallengeTemplate,
    );
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
        'please provide pictures for this challenge.',
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
  async updateChallenge(
    @Request() req: { user: SessionUserDTO },
    @Body() updateChallengeDTO: UpdateChallengeDTO,
  ) {
    return this.challengesService.update(req.user.userId, updateChallengeDTO);
  }

  @Get()
  async getChallenges(): Promise<SanitizedChallengeDTO[]> {
    return (await this.challengesService.findAll()).map((challenge) =>
      sanitize<SanitizedChallengeDTO>(challenge, sanitizedChallengeTemplate),
    );
  }
}
