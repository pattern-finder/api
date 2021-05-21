import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ObjectStorageModule,
  ],
  providers: [UsersService],
  exports: [UsersService, ObjectStorageModule],
})
export class UsersModule {}
