import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/models/user.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.getOrThrow(`DATA_BASE_HOST_${configService.getOrThrow<string>('NODE_ENV')}`),
        port: configService.getOrThrow(`DATA_BASE_PORT_${configService.getOrThrow<string>('NODE_ENV')}`),
        username: configService.getOrThrow(`DATA_BASE_USERNAME_${configService.getOrThrow<string>('NODE_ENV')}`),
        password: configService.getOrThrow(`DATA_BASE_PASSWORD_${configService.getOrThrow<string>('NODE_ENV')}`),
        database: configService.getOrThrow(`DATA_BASE_NAME_${configService.getOrThrow<string>('NODE_ENV')}`),
        models: [User],
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}