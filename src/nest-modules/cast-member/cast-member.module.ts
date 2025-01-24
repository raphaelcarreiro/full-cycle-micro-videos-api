import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMemberController } from './cast-member.controller';
import { CAST_MEMBER_PROVIDERS } from './cast-member-providers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMemberController],
  providers: [...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES), ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES)],
})
export class CastMemberModule {}
