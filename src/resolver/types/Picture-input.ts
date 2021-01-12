import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
import { Picture } from "../../entities/Picture";

@InputType()
export class PictureInput implements Partial<Picture> {
  @Field()
  @Length(1, 255)
  name: String;

  @Field()
  description: String;

  @Field()
  link: String;

  @Field()
  publicVisible: boolean;
}