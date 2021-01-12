import Redis from 'ioredis'

import dotenv from 'dotenv'
dotenv.config();

export const redis = new Redis({
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT as string),
    password: process.env.REDIS_PASS as string
});