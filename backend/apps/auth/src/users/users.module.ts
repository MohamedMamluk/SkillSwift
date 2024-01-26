import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { User, userSchema } from './models/user.schema';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
