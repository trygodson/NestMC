// import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  //
  constructor(private readonly entityRepository: Repository<T>, private readonly entityManager: EntityManager) {}

  // For Mongoose
  // constructor(protected readonly model: Model<TDocument>) {}

  // For mongoose
  // async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
  //   const createdDocument = new this.model({
  //     ...document,
  //     _id: new Types.ObjectId(),
  //   });
  //   return (await createdDocument.save()).toJSON() as unknown as TDocument;
  // }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entityRepository.save(data);
  }
  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entityRepository.save(data);
  }
  public create(data: T): Promise<T> {
    return this.entityManager.save(data);
  }
  // public create(data: DeepPartial<T>): T {
  //   return this.entityRepository.create(data);
  // }
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entityRepository.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entityRepository.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entityRepository.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entityRepository.find(relations);
  }

  public async findAll(filterCondition?: FindManyOptions<T>): Promise<T[]> {
    return await this.entityRepository.find(filterCondition);
  }

  public async remove(data: T): Promise<T> {
    return await this.entityRepository.remove(data);
  }
  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entityRepository.preload(entityLike);
  }

  async findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({
      where,
      relations,
    });

    if (!entity) {
      this.logger.warn('Entiy Not Found with Where', where);
      throw new NotFoundException('Enitiy Not Found');
    }
    return entity;
  }
  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    const updatedResult = await this.entityRepository.update(where, partialEntity);

    if (!updatedResult.affected) {
      this.logger.warn('Entity Not Found With Where', where);
      throw new NotFoundException('Enitiy Not Found');
    }

    return this.findOne(where, relations);
  }

  async find(where: FindOptionsWhere<T>) {
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }
}
