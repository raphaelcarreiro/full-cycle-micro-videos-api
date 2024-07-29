import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Max,
  validateSync,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../shared/validators/class-validator-fields";

export class CategoryRules {
  @Max(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Max(255)
  @IsString()
  @IsNotEmpty()
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
