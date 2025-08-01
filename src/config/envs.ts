import 'dotenv/config';
import * as joi from 'joi';

enum JWT_MODE {
    COOKIE = 'COOKIE',
    BEARER = 'BEARER',
}

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string;
    JWT_SOURCE: JWT_MODE
    JWT_SECRET: string
    NODE_ENV: 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';
}

const envsSchema = joi.object<EnvVars>({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    JWT_SOURCE: joi.string().valid(...Object.values(JWT_MODE)).required(),
    JWT_SECRET: joi.string().required(),
        NODE_ENV: joi.string().valid('DEVELOPMENT', 'PRODUCTION', 'TESTING').required()
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars : EnvVars = value

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    jwtSource: envVars.JWT_SOURCE,
    jwtSecret: envVars.JWT_SECRET,
    nodeEnv: envVars.NODE_ENV
}
