import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { prop as Property, getModelForClass } from '@typegoose/typegoose'

@ObjectType({ description: 'The User model' })
export class User {
    @Field(() => ID)
    id: ObjectId

    @Field()
    @Property()
    username: String

    @Property({ required: true })
    password: String

    @Field()
    @Property({ required: true, unique: true })
    email: String
}

export const UserModel = getModelForClass(User)
