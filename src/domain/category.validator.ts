import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  validateSync,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../shared/domain/validators/class-validator-fields";

export class CategoryRules {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: string;

  constructor({ name, description, is_active }: Category) {
    Object.assign(this, { name, description, is_active });
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(category: Category) {
    return super.validate(new CategoryRules(category));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
