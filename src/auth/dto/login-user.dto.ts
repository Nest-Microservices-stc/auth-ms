import { IsEmail, IsString, IsStrongPassword, Matches } from "class-validator";

export class LoginUserDto {
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