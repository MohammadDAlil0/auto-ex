import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";
import { SEQUELIZE } from "src/constants/constants";

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize({
                dialect: configService.getOrThrow(`DATA_BASE_DIALECT_${configService.getOrThrow('NODE_ENV')}`),
                host: configService.getOrThrow(`DATA_BASE_HOST_${configService.getOrThrow<string>('NODE_ENV')}`),
                port: configService.getOrThrow(`DATA_BASE_PORT_${configService.getOrThrow<string>('NODE_ENV')}`),
                username: configService.getOrThrow(`DATA_BASE_USERNAME_${configService.getOrThrow<string>('NODE_ENV')}`),
                password: configService.getOrThrow(`DATA_BASE_PASSWORD_${configService.getOrThrow<string>('NODE_ENV')}`),
                database: configService.getOrThrow(`DATA_BASE_NAME_${configService.getOrThrow<string>('NODE_ENV')}`)
            });
        }
    }
] 