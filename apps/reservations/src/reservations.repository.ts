import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from './models/reservation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationRepository extends AbstractRepository<Reservation> {
  protected logger: Logger = new Logger(ReservationRepository.name);

  constructor(
    @InjectRepository(Reservation) reservationRepository: Repository<Reservation>,
    entityManger: EntityManager,
  ) {
    super(reservationRepository, entityManger);
  }

  // For mongoose
  // constructor(@InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>) {
  //   super(reservationModel);
  // }
}
