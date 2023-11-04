import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateChargeDto, PaymentServiceController, PaymentServiceControllerMethods } from '@app/common';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentController implements PaymentServiceController {
  constructor(private readonly paymentService: PaymentService) {}

  // @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(data: PaymentCreateChargeDto) {
    // throw new Error();
    return this.paymentService.createCharge(data);
  }
}
