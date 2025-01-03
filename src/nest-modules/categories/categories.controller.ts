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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/show/get-category.use-case';
import { GetCategoriesUseCase } from '@core/category/application/use-cases/list/get-categories.use-case';
import { CategoryPresenter } from './category.presenter';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { PaginationOutput } from '@core/shared/application/pagination-output';
import { CategoryCollectionPresenter } from './category-collection.presenter';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private readonly createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private readonly updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private readonly deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private readonly getCategoryUseCase: GetCategoryUseCase;

  @Inject(GetCategoriesUseCase)
  private readonly getCategoriesUseCase: GetCategoriesUseCase;

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(dto);
    return this.serialize(output);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getCategoryUseCase.execute({ id });
    return this.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
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
  async search(@Query() query: GetCategoriesDto) {
    const output = await this.getCategoriesUseCase.execute(query);

    return this.serializeCollection(output);
  }

  private serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }

  private serializeCollection(output: PaginationOutput<CategoryOutput>) {
    return new CategoryCollectionPresenter(output);
  }
}
