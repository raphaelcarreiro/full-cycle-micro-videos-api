import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DB_SCHEMA_TYPE } from 'src/nest-modules/config/config.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService<DB_SCHEMA_TYPE>) => {
        const dbVendor = config.get('DB_VENDOR');

        if (dbVendor === 'sqlite') {
          return {
            dialect: 'sqlite',
            storage: config.get('DB_DATABASE'),
            logging: config.get('DB_LOGGING'),
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            synchronize: true,
          };
        }

        if (dbVendor === 'mysql') {
          return {
            dialect: 'mysql',
            host: config.get('DB_HOST'),
            port: config.get('DB_PORT'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_DATABASE'),
            logging: config.get('DB_LOGGING'),
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            synchronize: true,
          };
        }

        throw new Error(`Unsupported database vendor: ${dbVendor}`);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
