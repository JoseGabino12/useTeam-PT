import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UserRepositoryImpl } from './user.repository.impl';
import { CreateUserDto } from '../application/dto/create-user.dto';

@Controller('users')
export class UsersController {
  private createUserUseCase: CreateUserUseCase;

  constructor(private readonly userRepository: UserRepositoryImpl) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.createUserUseCase.execute(data);
  }

  @Get()
  async findAll() {
    return this.userRepository.findAll();
  }

  @Get('all')
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }));
  }
}
