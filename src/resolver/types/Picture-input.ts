import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
import { Picture } from "../../entities/Picture";
import { ObjectId } from "mongodb";

@InputType()
export class PictureInput implements Partial<Picture> {
  @Field()
  id: number
  
  @Field()
  name: String;

  @Field()
  @Length(1, 255)
  description: String;

  @Field()
  uploadDate: Date;

  @Field()
  link: string

}