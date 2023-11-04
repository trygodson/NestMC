import { CreateChargeDto, CreateChargeMessage } from '@app/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PaymentCreateChargeDto extends CreateChargeDto implements CreateChargeMessage {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
