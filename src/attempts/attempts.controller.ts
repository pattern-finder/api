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
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDTO } from './dto/create-attempt.dto';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import {
  SanitizedAttemptDTO,
  sanitizedAttemptTemplate,
} from './dto/sanitized-attempt.dto';

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
    const challenge = await this.challengeService.findOne({
      id: createAttemptDTO.challenge,
    });

    if (!challenge) {
      throw new NotFoundException( // TODO replace this logic with a validator !
        'Challenge with specified ID does not exist.',
      );
    }

    return this.attemptsService.create({
      ...createAttemptDTO,
      user: req.user.userId,
      challenge: challenge,
    });
  }

  // @UseInterceptors(LinkifyInterceptor)
  @Get(':id')
  async getAttempt(
    @Param() findAttemptDTO: FindByIdDTO,
  ): Promise<SanitizedAttemptDTO> {
    const attempt = await this.attemptsService.findOne(findAttemptDTO);

    if (!attempt) {
      throw new NotFoundException('Attempt with specified ID does not exist.');
    }

    return sanitize<SanitizedAttemptDTO>(attempt, sanitizedAttemptTemplate);
  }

  // @UseInterceptors(LinkifyInterceptor)
  @Get()
  async getAttempts(): Promise<SanitizedAttemptDTO[]> {
    return (await this.attemptsService.findAll()).map((attempt) =>
      sanitize<SanitizedAttemptDTO>(attempt, sanitizedAttemptTemplate),
    );
  }
}
