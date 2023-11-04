import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import {
  NOTIFICATIONS_SERVICE,
  NOTIFICATION_SERVICE_NAME,
  NotificationServiceClient,
  PAYMENT_SERVICE,
} from '@app/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';
@Injectable()
export class PaymentService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-08-16',
  });
  private notificationService: NotificationServiceClient;
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}
  // onModuleInit() {
  //   this.notificationService = this.client.getService<NotificationServiceClient>(NOTIFICATION_SERVICE_NAME);
  // }

  async createCharge({ id, amount, email }: PaymentCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });
    if (!this.notificationService) {
      this.notificationService = this.client.getService<NotificationServiceClient>(NOTIFICATION_SERVICE_NAME);
    }

    this.notificationService.notifyEmail({ email, text: `Your Payment of $${amount} has been completed` });

    return paymentIntent;
  }
}
