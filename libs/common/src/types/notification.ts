/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

// export const protobufPackage = "notification";

export interface Empty {}

export interface NotifyEmailMessage {
  email: string;
  text: string;
}

export const NOTIFICATION_PACKAGE_NAME = 'notification';

export interface NotificationServiceClient {
  notifyEmail(request: NotifyEmailMessage): Observable<Empty>;
}

export interface NotificationServiceController {
  notifyEmail(request: NotifyEmailMessage): Promise<Empty> | Observable<Empty> | Empty;
}

export function NotificationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['notifyEmail'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('NotificationService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('NotificationService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTIFICATION_SERVICE_NAME = 'NotificationService';
