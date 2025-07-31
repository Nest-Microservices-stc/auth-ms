import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HandleErrorsService } from 'src/common/services/rpc/handle-errors.service';
import { BcryptService, JwtService } from './services';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {

  private context = 'auth';
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly globalErrors: HandleErrorsService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) { }

  async create(registerUserDto: RegisterUserDto) {
    try {
      const hashedPassword = await this.bcryptService.hashPassword(registerUserDto.password);
      const user = await this.userRepository.create({ ...registerUserDto, password: hashedPassword });
      return {
        message: 'Your account has been created successfully',
        user
      }
    } catch (error) {
      this.globalErrors.handleError(error, this.context);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.find(loginUserDto.email, true);
    if (!user) this.globalErrors.throwRpcException('User not found', HttpStatus.NOT_FOUND);
    const match = await this.bcryptService.comparePassword(loginUserDto.password, user.password);
    if (!match) this.globalErrors.throwRpcException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return {
      message: `Welcome, ${user.name}, great to see you again`,
      token: this.jwtService.getJwt({ id: user.id })
    }
  }

  async validate(token: string) {
    try {
      const { newToken, payload } = this.jwtService.maybeRenewJwt(token);
      const user = await this.userRepository.infoUser(payload.id);
      if (!user) this.globalErrors.throwRpcException('User not found', HttpStatus.NOT_FOUND);
      return {
        user,
        token: newToken || null
      };
    } catch (e) {
      this.globalErrors.throwRpcException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

}
