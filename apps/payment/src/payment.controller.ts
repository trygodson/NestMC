import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentCreateChargeDto, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();

    const originalMessage = rmqContext.getMessage();

    channel.ack(originalMessage);
    // throw new Error();
    return this.paymentService.createCharge(data);
  }
}
