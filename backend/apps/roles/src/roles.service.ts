import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create_role.dto';
import { DuplicateException } from '@app/common';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepo: RolesRepository) {}

  async create(createRoleBody: CreateRoleDto) {
    try {
      const role = await this.rolesRepo.create(createRoleBody);
      return role;
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateException(error.keyValue.name);
      } else {
        throw error;
      }
    }
  }
}
