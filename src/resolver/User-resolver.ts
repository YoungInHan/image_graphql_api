import {
    Resolver,
    Mutation,
    Arg,
    Query,
    Ctx,
    UseMiddleware,
} from 'type-graphql'
import { User, UserModel } from '../entities/Users'
import { UserInput } from './input-types/User-input'
import bcrypt from 'bcrypt'
import { MyContext } from '../types/MyContext'
import { isAuth } from '../middleware/isAuth'

@Resolver((_of) => User)
export class UserResolver {
    @UseMiddleware(isAuth)
    @Query(() => String)
    async returnHelloWorld() {
        return 'HEY WORLD'
    }

    @Mutation(() => User)
    async createUser(
        @Arg('data') { username, email, password }: UserInput
    ): Promise<User> {
        const hashedPassword: String = await bcrypt.hash(password, 12)
        const user = await UserModel.create({
            username: username,
            password: hashedPassword,
            email: email,
        })

        await user.save()
        return user
    }

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.password as string)

        if (!valid) {
            return null
        }

        ctx.req.session.userId = user.id

        return user
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | null> {
        if (!ctx.req.session.userId) {
            return null
        }
        return UserModel.findOne({ _id: ctx.req.session.userId })
    }
}
