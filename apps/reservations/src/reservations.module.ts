import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  DatabaseModule,
  LoggerModule,
  PAYMENT_PACKAGE_NAME,
  PAYMENT_SERVICE_NAME,
} from '@app/common';
import { ReservationRepository } from './reservations.repository';
import { Reservation } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: AUTH_PACKAGE_NAME,
              protoPath: join(__dirname, '../../../proto/auth.proto'),
              url: configService.getOrThrow('AUTH_GRPC_URL'),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: PAYMENT_PACKAGE_NAME,
              protoPath: join(__dirname, '../../../proto/payment.proto'),
              url: configService.getOrThrow('PAYMENT_GRPC_URL'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    DatabaseModule.forFeature([Reservation]),

    // For Mongoose
    // DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    LoggerModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
