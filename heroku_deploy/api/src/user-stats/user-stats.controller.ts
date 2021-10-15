import { Controller, Get, Param } from '@nestjs/common';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { UserStatsService } from './user-stats.service';

@Controller('stats')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Get('default_series/:id')
  async completion(@Param() userIdObject: FindByIdDTO) {
    console.log("userIdObject")
    console.log(userIdObject)
    return await this.userStatsService.getCompletion(userIdObject);
  }

  @Get('execs/:id')
  async execs(@Param() userIdObject: FindByIdDTO) {
    return await this.userStatsService.getExecStats(userIdObject);
  }
}
