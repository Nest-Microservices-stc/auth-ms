import { Controller, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  create(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.create(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  login(@Payload() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('auth.verify.user')
  verify(@Payload('token') token: string) {
    return this.authService.validate(token);
  }
}
