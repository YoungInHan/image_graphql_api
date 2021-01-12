import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { User, UserModel } from '../entities/Users'
import { UserInput } from './types/User-input'
import bcrypt from 'bcrypt'
import { MyContext } from '../types/MyContext'

@Resolver(_of => User)
export class UserResolver {

    @Query(() => String)
    async returnHelloWorld(){
      return "HEY WORLD"
    };

    @Mutation(() => User)
    async createUser(@Arg("data"){username, email, password}: UserInput): Promise<User> { 
      const hashedPassword : String = await bcrypt.hash(password, 12);
      const user = await UserModel.create({
        username: username,
        password: hashedPassword,
        email: email
      });

      await user.save();
      return user;
    };

    @Mutation(() => User, {nullable: true})
    async login(
      @Arg("email") email: string,
      @Arg("password") password: string,
      @Ctx() ctx: MyContext
    ): Promise<User | null> {
      console.log(email)
      console.log(password)
      const user = await UserModel.findOne({email: email})

      console.log(user)

      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password as string)

      if (!valid) {
        return null;
      }

      ctx.req.session.userId = user.id

      return user;
    }

    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: MyContext) : Promise<User | null> {
      console.log(ctx.req.session)
  
      if (!ctx.req.session.userId) {
        return null;
      }
      return UserModel.findOne({_id: ctx.req.session.userId})
    };

    
}