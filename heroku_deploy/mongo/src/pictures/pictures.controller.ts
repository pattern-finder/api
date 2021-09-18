import { Controller, Delete, Param, Request } from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { DeletePictureDTO } from './dto/delete-picture.dto';
import { PicturesService } from './pictures.service';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Delete(':bucket/:id')
  async deletePicture(
    @Request() req: { user: SessionUserDTO },
    @Param() deletePictureDTO: DeletePictureDTO,
  ) {
    await this.picturesService.delete(
      deletePictureDTO,
      deletePictureDTO.bucket,
    );
  }
}
