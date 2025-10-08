import { User } from '../../../../modules/users/domain/user.entity';
import { IUserRepository } from '../../../users/domain/user.repository';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

export class LoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(
    dto: LoginUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new Error('Invalid credentials');

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = await this.jwt.signAsync(payload);

    return { user: { ...user }, accessToken };
  }
}
