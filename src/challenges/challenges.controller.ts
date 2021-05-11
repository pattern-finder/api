import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Controller('/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get(':id')
  async getChallenge(
    @Body() findByIdDTO: FindByIdDTO,
  ): Promise<ChallengeDocument> {
    const challenge = await this.challengesService.findOne(findByIdDTO.id);
    if (!challenge) {
      throw new NotFoundException(
        'Challenge with specified ID does not exist.',
      );
    }
    return challenge;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createChallenge(
    @Request() req: { user: SessionUserDTO },
    @Body() challengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengesService.create({
      ...challengeDTO,
      owner: req.user.userId,
    });
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
