import { UpdateCategoryInput } from '@core/category/application/use-cases/update/update-category.input';
import { OmitType } from '@nestjs/mapped-types';

class _UpdateCategoryDto extends OmitType(UpdateCategoryInput, ['id']) {}

export class UpdateCategoryDto extends _UpdateCategoryDto {}
