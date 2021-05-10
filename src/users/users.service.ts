import { Injectable } from '@nestjs/common';
import {
  Category,
  CategoryServiceFactory,
  CategoryConfiguration,
  LogLevel,
} from 'typescript-logging';

CategoryServiceFactory.setDefaultConfiguration(
  new CategoryConfiguration(LogLevel.Info),
);

// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
export const catService = new Category('service');
export const catProd = new Category('product', catService);

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }



  async addOne(user: any): Promise<User | undefined> {
    const newUser = {
      userId: this.users.length + 1,
      username: user.username,
      password: user.password,
    };

    const userExistCheck = this.findOne(user.username);

    if (userExistCheck == null) {
      this.users.push(newUser);
      return 'User ' + newUser.password + 'create';
    } else {
      return 'This name already exists';
    }
  }



  async updateOne(user: any, newUser: any): Promise<User> {
    //test si le nouveau mon d'utilisateur n'est pas déja utilisé par qq d'autre
    if (user.username != newUser.username) {
      const userExistCheck = this.findOne(newUser.username);

      if (userExistCheck != null) {
        return 'This username already exist, ';
      }
    }

    const index = this.users.findIndex(
      (user) => user.userId === newUser.userId,
    );

    Object.assign(this.users[index], newUser);

    return this.users[index];
  }








  async  getToken(code: string): Promise<String> {

    let data = code["code"];
    let buff = new Buffer(data);
    let codesend = buff.toString('base64');

    const request = require('request');
    let apiKeyJudge = process.env["API_KEY_JUDGEZERO"];

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      qs: {base64_encoded: 'true', fields: '*'},
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': apiKeyJudge,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        useQueryString: true
      },
      body: {
        language_id: 46,
        source_code: codesend,
        stdin: 'SnVkZ2Uw'
      },
      json: true
    };

    return new Promise ((resolve, ) =>{

    request(options, function (error, response, body)  {
      if (error) throw new Error(error);
      // console.log(body);
       let json_body = JSON.stringify(body);
      // console.log(json_body);
       resolve(json_body);
    });
  });

}







  async  getCompile(tokenJSON: string): Promise<String> {

    const request = require('request');
    let token = tokenJSON["token"]
    let apiKeyJudge = process.env["API_KEY_JUDGEZERO"];
    const options = {
      method: 'GET',
      url: 'https://judge0-ce.p.rapidapi.com/submissions/'+token,
      qs: {base64_encoded: 'true', fields: '*'},
      headers: {
        'x-rapidapi-key': apiKeyJudge,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        useQueryString: true
      }
    };
    
    return new Promise ((resolve, ) =>{
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      let jsonbody = JSON.parse(body);
      let data = jsonbody["stdout"]
      let buff = new Buffer(data, 'base64');
      let codeCompile = buff.toString('ascii');

      //console.log(data);
      resolve(codeCompile)
    });
  });
  
  }






}
