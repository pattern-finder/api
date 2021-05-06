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

  async updateOne(user: any, newUser: any): Promise<User | undefined> {
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
}
