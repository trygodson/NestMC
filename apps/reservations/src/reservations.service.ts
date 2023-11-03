import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENT_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
  ) {}
  async create(createReservationDto: CreateReservationDto, { email, id }: User) {
    console.log(createReservationDto);
    return this.paymentService.send('create_charge', { ...createReservationDto.charge, email }).pipe(
      map(async (res) => {
        const reservation = new Reservation({
          ...createReservationDto,
          invoiceId: res?.id,
          timeStamp: new Date(),
          userId: +id,
        });
        return await this.reservationRepository.create(reservation);
      }),
    );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationRepository.findOne({
      id: id,
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate({ id }, updateReservationDto);
    // return this.reservationRepository.findOneAndUpdate({ id}, { $set: updateReservationDto });
  }

  async remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
