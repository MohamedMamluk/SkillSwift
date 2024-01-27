import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto) {
    return this.userRepository.create(userData);
  }
  async getUser(userData: { _id: string }) {
    return this.userRepository.findOne(userData);
  }
  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ email });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
