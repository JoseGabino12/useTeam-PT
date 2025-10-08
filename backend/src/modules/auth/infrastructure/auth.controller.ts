import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { UserRepositoryImpl } from '../../users/infrastructure/user.repository.impl';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  private registerUC: RegisterUseCase;
  private loginUC: LoginUseCase;

  constructor(
    private readonly usersRepo: UserRepositoryImpl,
    private readonly jwt: JwtService,
  ) {
    this.registerUC = new RegisterUseCase(this.usersRepo);
    this.loginUC = new LoginUseCase(this.usersRepo, this.jwt);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUC.execute(dto);
    const { password: _password, ...safe } = user;
    return safe;
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginUserDto) {
    return this.loginUC.execute(dto);
  }
}
