import { User } from "generated/prisma";

export interface JwtPayloadInterface {
    id: User['id']
}

export interface JwtPayloadWithUser extends JwtPayloadInterface {
    exp: number
    iat: number
}