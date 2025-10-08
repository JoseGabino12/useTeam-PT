import { IUserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import bcrypt from 'bcrypt';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User(
      crypto.randomUUID(),
      data.name,
      data.email,
      hashedPassword,
      data.avatar || '',
      new Date(),
      new Date(),
    );
    return this.userRepository.create(user);
  }
}
