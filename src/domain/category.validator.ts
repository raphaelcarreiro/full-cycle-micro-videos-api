import { IsBoolean, IsNotEmpty, IsString, Max } from "class-validator";

class CategoryRules {
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
}

export class CategoryValidator {}
