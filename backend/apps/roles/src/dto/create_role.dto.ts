import { IsPositive, IsString, Min } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsPositive()
  @Min(1)
  level: number;
}
