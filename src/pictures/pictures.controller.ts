import { Controller, Delete, Param } from '@nestjs/common';
import { DeletePictureDTO } from './dto/delete-picture.dto';
import { PicturesService } from './pictures.service';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Delete(':bucket/:id')
  async deletePicture(@Param() deletePictureDTO: DeletePictureDTO) {
    await this.picturesService.delete(
      deletePictureDTO.id,
      deletePictureDTO.bucket,
    );
  }
}
