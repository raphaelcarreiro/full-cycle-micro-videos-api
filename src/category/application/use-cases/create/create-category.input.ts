import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

type Payload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(payload: Payload) {
    this.name = payload.name;
    this.description = payload.description;
    this.is_active = payload.is_active;
  }
}

export class ValidateCreateCategoryInput {
  static validate(payload: Payload) {
    validateSync(new CreateCategoryInput(payload));
  }
}
