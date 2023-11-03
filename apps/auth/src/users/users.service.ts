import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { GetUserDto } from './dtos/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUser: CreateUserDto) {
    await this.validateCreateUser(createUser);

    const user = new User({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
      roles: createUser.roles?.map((roleDto) => new Role({ name: roleDto })),
    });
    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      const res = await this.usersRepository.findOne({ email: createUser.email }, {});
      console.log(res, '-----validateCreateUser---');
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email Already Exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email }, {});
    if (user) {
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new UnauthorizedException('Credentials Not Valid');
      } else {
        return user;
      }
    } else {
      throw new UnauthorizedException('User Does Not Exist');
    }
  }

  async getUser({ id }: GetUserDto) {
    return this.usersRepository.findOne({ id: id }, { roles: true });
  }
}
