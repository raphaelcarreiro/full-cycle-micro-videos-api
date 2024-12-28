import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories/categories.module';
import { ConfigModule } from './nest-modules/config/config.module';
import { DatabaseModule } from './nest-modules/database/database.module';
import { SharedModule } from './nest-modules/shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), CategoriesModule, DatabaseModule, SharedModule],
})
export class AppModule {}
