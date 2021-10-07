import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { PicspyBucket } from 'src/object-storage/object-storage.service';

export class DeletePictureDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsEnum(PicspyBucket)
  @IsNotEmpty()
  bucket: PicspyBucket;
}
