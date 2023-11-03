import { AbstractEntity } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Column, Entity } from 'typeorm';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  timeStamp: Date;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  userId: number;

  @Column()
  invoiceId: string;
}

//For Mongoose
// @Schema({ versionKey: false })
// export class ReservationDocument extends AbstractDocument {
//   @Prop()
//   timeStamp: Date;

//   @Prop()
//   startDate: Date;

//   @Prop()
//   endDate: Date;

//   @Prop()
//   userId: string;

//   @Prop()
//   invoiceId: string;
// }

// export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);
