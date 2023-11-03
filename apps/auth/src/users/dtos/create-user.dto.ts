import { Role } from '@app/common';
import { Type } from 'class-transformer';
import { IsEmail, IsStrongPassword, IsOptional, IsArray, IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UserDto)
  roles?: UserDto[];
}
class UserDto {
  @IsString()
  name: string;
}
