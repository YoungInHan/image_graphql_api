import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './Users'

@ObjectType({ description: 'The Picture model' })
export class Picture {
    @Field(() => ID)
    id: ObjectId

    @Field()
    @Property()
    name: String

    @Field({ nullable: true })
    @Property()
    description: String

    @Field()
    @Property()
    link: String

    @Field()
    @Property()
    uploadDate: Date

    @Field()
    @Property()
    publicVisible: boolean

    @Field(() => [String])
    @Property({ type: () => [String], default: [] })
    tags: String[]

    @Field(() => User)
    @Property({ ref: User })
    uploader?: Ref<User>
}

export const PictureModel = getModelForClass(Picture)
