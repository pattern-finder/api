import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { CreateExecBootstrapDTO } from './dto/create-exec-bootstrap.dto';
import {
  DetailedExecBootstrapDTO,
  detailedExecBootstrapTemplate,
} from './dto/detailed-exec-bootstrap.dto';
import { UpdateExecBootstrapDTO } from './dto/update-exec-bootstrap.dto';
import { ExecBootstrap } from './exec-bootstrap.schema';
import { ExecBootstrapsService } from './exec-bootstraps.service';

@Controller('/exec-bootstraps')
export class ExecBootstrapsController {
  constructor(private readonly execBootstrapsService: ExecBootstrapsService) {}

  @Get(':id')
  async getExecBootstrap(
    @Param() findByIdDTO: FindByIdDTO,
  ): Promise<DetailedExecBootstrapDTO> {
    const execBootstrap = await this.execBootstrapsService.findOne(findByIdDTO);
    if (!execBootstrap) {
      throw new NotFoundException(
        'ExecBootstrap with specified ID does not exist.',
      );
    }
    return sanitize<DetailedExecBootstrapDTO>(
      execBootstrap,
      detailedExecBootstrapTemplate,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExecBootstrap(
    @Body() execBootstrapDTO: CreateExecBootstrapDTO,
  ): Promise<ExecBootstrap> {
    return this.execBootstrapsService.create(execBootstrapDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateExecBootstrap(
    @Body() updateExecBootstrapDTO: UpdateExecBootstrapDTO,
  ) {
    return this.execBootstrapsService.update(updateExecBootstrapDTO);
  }

  @Get()
  async getExecBootstraps(): Promise<DetailedExecBootstrapDTO[]> {
    return (await this.execBootstrapsService.findAll()).map((execBootstrap) =>
      sanitize<DetailedExecBootstrapDTO>(
        execBootstrap,
        detailedExecBootstrapTemplate,
      ),
    );
  }
}
