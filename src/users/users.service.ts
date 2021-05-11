import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encrypt } from 'src/common/crypt.handler';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username });
  }

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    if (await this.findByUsername(createUserDTO.username)) {
      throw new UnprocessableEntityException(
        `Username ${createUserDTO.username} already taken.`,
      );
    }
    return await new this.userModel({
      ...createUserDTO,
      createdAt: new Date(),
      password: await encrypt(createUserDTO.password),
    }).save();
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserDocument> {
    console.log(id);
    return await this.userModel
      .findByIdAndUpdate(id, {
        ...updateUserDTO,
        editedAt: new Date(),
        password: updateUserDTO.password
          ? await encrypt(updateUserDTO.password)
          : undefined,
      })
      .exec();
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }








  // async  getToken(code: string): Promise<String> {

  //   let data = code["code"];
  //   let buff = new Buffer(data);
  //   let codesend = buff.toString('base64');

  //   let apiKeyJudge = process.env["API_KEY_JUDGEZERO"];

  //   const options = {
  //     method: 'POST',
  //     url: 'https://judge0-ce.p.rapidapi.com/submissions',
  //     qs: {base64_encoded: 'true', fields: '*'},
  //     headers: {
  //       'content-type': 'application/json',
  //       'x-rapidapi-key': apiKeyJudge,
  //       'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  //       useQueryString: true
  //     },
  //     body: {
  //       language_id: 46,
  //       source_code: codesend,
  //       stdin: 'SnVkZ2Uw'
  //     },
  //     json: true
  //   };

  //   return new Promise ((resolve, ) =>{

  //   request(options, function (error, response, body)  {
  //     if (error) throw new Error(error);
  //     // console.log(body);
  //      let json_body = JSON.stringify(body);
  //     // console.log(json_body);
  //      resolve(json_body);
  //   });
  // });

}







  // async  getCompile(tokenJSON: string): Promise<String> {

  //   let token = tokenJSON["token"]
  //   let apiKeyJudge = process.env["API_KEY_JUDGEZERO"];
  //   const options = {
  //     method: 'GET',
  //     url: 'https://judge0-ce.p.rapidapi.com/submissions/'+token,
  //     qs: {base64_encoded: 'true', fields: '*'},
  //     headers: {
  //       'x-rapidapi-key': apiKeyJudge,
  //       'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  //       useQueryString: true
  //     }
  //   };
    
  //   return new Promise ((resolve, ) =>{
  //   request(options, function (error, response, body) {
  //     if (error) throw new Error(error);
    
  //     let jsonbody = JSON.parse(body);
  //     let data = jsonbody["stdout"]
  //     let buff = new Buffer(data, 'base64');
  //     let codeCompile = buff.toString('ascii');

  //     //console.log(data);
  //     resolve(codeCompile)
  //   });
  // });
  
  // }






// }
