import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { connect } from 'mongoose'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { graphqlUploadExpress } from 'graphql-upload'
import { redis } from './redis'
import { PictureResolver } from './resolver/Picture-resolver'
import { UserResolver } from './resolver/User-resolver'
import { SearchResolver } from './resolver/Search-resolver'

import dotenv from 'dotenv'
dotenv.config()

const MONGO_DB_URL = process.env.MONGO_DB_URL as string

const main = async () => {
    const mongoose = await connect(MONGO_DB_URL, { useNewUrlParser: true })
    await mongoose.connection

    const schema = await buildSchema({
        resolvers: [UserResolver, PictureResolver, SearchResolver],
        dateScalarMode: 'timestamp',
    })

    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
        uploads: false,
        context: ({ req }: any) => ({ req }),
    })

    const app = Express()

    const RedisStore = connectRedis(session)

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

    app.use(
        cors({
            credentials: true,
        })
    )

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: 'qid',
            secret: process.env.MADE_SECRET as string,
            resave: false,
            saveUninitialized: false,
            proxy: true,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        })
    )
    server.applyMiddleware({ app })
    const port = Number(process.env.PORT)
    app.listen({ port }, () => {})
}

main().catch((error) => {
    console.log(`ERROR: ${error}`)
})
