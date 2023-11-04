/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

// export const protobufPackage = "payment";

export interface CardMessage {
  id: string;
}

export interface CreateChargeMessage {
  email: string;
  amount: number;
  /** CardMessage card = 3; */
  id: string;
}

export interface CreateChargeResponse {
  id: string;
}

export const PAYMENT_PACKAGE_NAME = 'payment';

export interface PaymentServiceClient {
  createCharge(request: CreateChargeMessage): Observable<CreateChargeResponse>;
}

export interface PaymentServiceController {
  createCharge(
    request: CreateChargeMessage,
  ): Promise<CreateChargeResponse> | Observable<CreateChargeResponse> | CreateChargeResponse;
}

export function PaymentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createCharge'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('PaymentService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('PaymentService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAYMENT_SERVICE_NAME = 'PaymentService';
