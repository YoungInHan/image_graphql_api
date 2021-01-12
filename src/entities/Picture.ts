import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

@ObjectType({ description: "The Picture model" })
export class Picture {
    @Field(() => ID)
    id: number; 

    @Field()
    @Property()
    name: String;

    @Field({nullable: true})
    @Property()
    description: String;

    @Field()
    @Property()
    link: String;

    @Field()
    @Property()
    uploadDate: Date;

    @Field()
    @Property()
    publicVisible: boolean;

    @Field(() => [String])
    @Property({ type: () => String, default: [] })
    tags: String[];
}

export const PictureModel = getModelForClass(Picture);