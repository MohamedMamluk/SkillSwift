import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from './models/role.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class RolesRepository extends AbstractRepository<Role> {
  protected readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectModel(Role.name) RolesModel: Model<Role>,
    @InjectConnection() connection: Connection,
  ) {
    super(RolesModel, connection);
  }
}
