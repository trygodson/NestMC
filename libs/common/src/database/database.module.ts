import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('MYSQL_HOST'),
          port: configService.getOrThrow('MYSQL_PORT'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          username: configService.getOrThrow('MYSQL_USERNAME'),
          password: configService.getOrThrow('MYSQL_PASSWORD'),
          synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
          autoLoadEntities: true,
          // uri: configService.get('MONGODB_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(model: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(model);
  }
}
// export class DatabaseModule {
//   static forFeature(model: ModelDefinition[]) {
//     return MongooseModule.forFeature(model);
//   }
// }
