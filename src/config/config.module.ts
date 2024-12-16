import { Module } from '@nestjs/common';
import { ConfigModuleOptions, ConfigModule as NestConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot({ envFilePath, ...optionProps }: ConfigModuleOptions = {}) {
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      ...optionProps,
    });
  }
}
