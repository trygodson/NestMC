// import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
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

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
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

  // For mongoose

  // async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
  //   const document = await this.model.findOne(filterQuery, {}, { lean: true });

  //   if (!document) {
  //     this.logger.warn('Document Not Found', filterQuery);
  //     throw new NotFoundException('Document Not Found');
  //   }
  //   return document as unknown as TDocument;
  // }

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
