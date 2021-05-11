import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dtos/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Controller('/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get(':id')
  getChallenge(@Request() req) {
    return req.challenge;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createChallenge(
    @Body() challengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengesService.create(challengeDTO);
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
  async getChallenges(): Promise<ChallengeDocument[]> {
    return this.challengesService.findAll();
  }
}
