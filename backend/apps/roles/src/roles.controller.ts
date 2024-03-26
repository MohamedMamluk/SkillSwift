import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create_role.dto';

@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('')
  async create(@Body() createRoleBody: CreateRoleDto) {
    return this.rolesService.create(createRoleBody);
  }
}
