import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChallengesService } from 'src/challenges/challenges.service';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { Attempt } from './attempt.schema';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDTO } from './dto/create-attempt.dto';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import { FetchedAttemptDTO } from './dto/fetched-attempt.dto';

@Controller('/attempts')
export class AttemptsController {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly challengeService: ChallengesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAttempt(
    @Request() req: { user: SessionUserDTO },
    @Body() createAttemptDTO: CreateAttemptDTO,
  ): Promise<ExecutionResultsDTO> {
    const challenge = await this.challengeService.findOne(
      createAttemptDTO.challenge,
    );

    if (!challenge) {
      throw new NotFoundException(
        'Challenge with specified ID does not exist.',
      );
    }

    return this.attemptsService.create({
      user: req.user.userId,
      ...createAttemptDTO,
    });
  }

  @Get(':id')
  async getAttempt(
    @Param() findAttemptDTO: FindByIdDTO,
  ): Promise<FetchedAttemptDTO> {
    const attempt = await this.attemptsService.findOne(findAttemptDTO);

    if (!attempt) {
      throw new NotFoundException('Attempt with specified ID does not exist.');
    }

    return attempt;
  }

  @Get()
  async getAttempts(): Promise<Attempt[]> {
    return await this.attemptsService.findAll();
  }
}
