import { AbstractRepository, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable({})
export class UsersRepository extends AbstractRepository<User> {
  protected logger: Logger = new Logger(UsersRepository.name);

  constructor(@InjectRepository(User) userRepository: Repository<User>, entityManger: EntityManager) {
    super(userRepository, entityManger);
  }

  // constructor(@InjectModel(User.name) userModel: Model<User>) {
  //   super(userModel);
  // }
}
