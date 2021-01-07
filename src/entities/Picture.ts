import { ObjectType, Field, ID, Int } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { __Type } from "graphql";

@ObjectType({ description: "The Picture model" })
export class Picture {
    @Field(() => ID)
    id: number; 

    @Field()
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;

    @Field()
    @Property()
    link: String;

    @Field()
    @Property()
    uploadDate: Date;
}

export const PictureModel = getModelForClass(Picture);