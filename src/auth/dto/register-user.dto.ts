import { IsString, IsEmail, Matches, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
  })
  password: string;
}
