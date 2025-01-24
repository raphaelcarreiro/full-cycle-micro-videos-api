import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create/create-cast-member.use-case';
import { DeleteCastMemberUseCase } from '@core/cast-member/application/use-cases/delete/delete-cast-member.use-case';
import { GetCastMembersUseCase } from '@core/cast-member/application/use-cases/list/get-cast-members.use-case';
import { GetCastMemberUseCase } from '@core/cast-member/application/use-cases/show/get-cast-member.use-case';
import { UpdateCastMemberUseCase } from '@core/cast-member/application/use-cases/update/update-cast-member.use-case';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';
import { GetCastMembersDto } from './dto/get-cast-members.dto';
import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMemberPresenter } from './cast-member.presenter';
import { CastMemberCollectionPresenter } from './cast-member-collection.presenter';
import { PaginationOutput } from '@core/shared/application/pagination-output';

@Controller('cast-members')
export class CastMemberController {
  @Inject(CreateCastMemberUseCase)
  private readonly createUseCase: CreateCastMemberUseCase;

  @Inject(UpdateCastMemberUseCase)
  private readonly updateUseCase: UpdateCastMemberUseCase;

  @Inject(DeleteCastMemberUseCase)
  private readonly deleteUseCase: DeleteCastMemberUseCase;

  @Inject(GetCastMemberUseCase)
  private readonly getUseCase: GetCastMemberUseCase;

  @Inject(GetCastMembersUseCase)
  private readonly searchUseCase: GetCastMembersUseCase;

  @Post()
  async create(@Body() dto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(dto);
    return this.serialize(output);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getUseCase.execute({ id });
    return this.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCastMemberDto,
  ) {
    const output = await this.updateUseCase.execute({ id, ...updateCategoryDto });
    return this.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return await this.deleteUseCase.execute({ id });
  }

  @Get()
  async search(@Query() query: GetCastMembersDto) {
    const output = await this.searchUseCase.execute(query);

    return this.serializeCollection(output);
  }

  private serialize(output: CastMemberOutput) {
    return new CastMemberPresenter(output);
  }

  private serializeCollection(output: PaginationOutput<CastMemberOutput>) {
    return new CastMemberCollectionPresenter(output);
  }
}
