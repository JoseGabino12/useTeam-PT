import { IUserRepository } from '../../../users/domain/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../../../users/domain/user.entity';
import bcrypt from 'bcrypt';

export class RegisterUseCase {
  constructor(private readonly users: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) {
      throw new Error('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = new User(
      crypto.randomUUID(),
      dto.name,
      dto.email,
      hashed,
      dto.avatar || '',
      new Date(),
      new Date(),
    );

    return this.users.create(user);
  }
}
