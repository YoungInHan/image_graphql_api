import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
import { Picture } from "../../entities/Picture";

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
  link: String;

  @Field()
  publicVisible: boolean;

}