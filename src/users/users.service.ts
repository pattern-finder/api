
import { Injectable } from '@nestjs/common';
import {Category,CategoryLogger,CategoryServiceFactory,CategoryConfiguration,LogLevel} from "typescript-logging";


CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));
 
// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
export const catService = new Category("service");
export const catProd = new Category("product", catService);


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
    return this.users.find(user => user.username === username);
  }

  async addOne(user: any): Promise<User | undefined> {


    var newUser =  {
      userId: this.users.length+1,
      username: user.username,
      password: user.password,
    }

    var userExistCheck = this.findOne(user.username)

    if(userExistCheck == null){

      this.users.push(newUser);
      return "User " + newUser.password + "create";

    }else{
      return "This name already exists"
    }
  }




  async updateOne(user: any, newuser: any): Promise<User | undefined> {
 
    catProd.info("Performing magic: " + user.username);


    var msg=""; 


    var notFound = true;
    var i = 0;


    //test si le nouveau mon d'utilisateur n'est pas déja utilisé par qq d'autre
    if(user.username != newuser.newusername){

      var userExistCheck = this.findOne(newuser.newusername)


      var notFound = true;
      var exist = false;

      var i = 0;
  
      while(notFound && this.users.length >i){
  
        var currentUser = this.users[i];

        if(currentUser.username == newuser.newusername){
          notFound = false;
          exist = true;

        }else{
          i++;
        }
      }

      if (exist){
        return "This username already exist, "
      }

    }


    var notFound = true;
    var i = 0;

    while(notFound && i<2 ){

      var currentUser = this.users[i];

      if(currentUser.userId == newuser.userId){
        notFound = false;
      }else{
        i++;
      }
    }

    newuser.userId = user.userId;

    this.users.splice(i,1);
    this.users.push(newuser);

    return this.users;
    
  }

}
