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
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDTO } from './dto/create-attempt.dto';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import { FindByUserAndBootstrapDTO } from './dto/find-by-user-and-bootstrap.dto';
import {
  SanitizedAttemptDTO,
  sanitizedAttemptTemplate,
} from './dto/sanitized-attempt.dto';

@Controller('/attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAttempt(
    //TODO get internal link for godbox, not external
    @Request() req: { user: SessionUserDTO },
    @Body() createAttemptDTO: CreateAttemptDTO,
  ): Promise<ExecutionResultsDTO> {
    return this.attemptsService.create({
      ...createAttemptDTO,
      user: req.user.userId,
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
  @Get('find-by-user-and-bootstrap/:user/:execBootstrap')
  async getAttemptByUserAndBootstrap(
    @Param() findAttemptDTO: FindByUserAndBootstrapDTO,
  ): Promise<SanitizedAttemptDTO[]> {
    return (
      await this.attemptsService.findByUserAndBootstrap(findAttemptDTO)
    ).map((attempt) =>
      sanitize<SanitizedAttemptDTO>(attempt, sanitizedAttemptTemplate),
    );
  }

  @Get('user/:id')
  async getChallengesByUser(
    @Param() userIdDTO: FindByIdDTO,
  ): Promise<SanitizedAttemptDTO[]> {
    return (await this.attemptsService.findByUser(userIdDTO)).map((attempt) =>
      sanitize<SanitizedAttemptDTO>(attempt, sanitizedAttemptTemplate),
    );
  }

  // @UseInterceptors(LinkifyInterceptor)
  @Get()
  async getAttempts(): Promise<SanitizedAttemptDTO[]> {
    return (await this.attemptsService.findAll()).map((attempt) =>
      sanitize<SanitizedAttemptDTO>(attempt, sanitizedAttemptTemplate),
    );
  }
}
