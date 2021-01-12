// import { Resolver, Mutation, Arg, Query,  FieldResolver, Root } from "type-graphql";
// import { Picture, PictureModel } from "../entities/Picture";
// import { PictureInput } from "./types/Picture-input"


// @Resolver(_of => Picture)
// export class PictureResolver {

//     @Query(_returns => Picture, { nullable: false})
//     async returnSinglePicture(@Arg("id") id: string){
//       return await PictureModel.findById({_id:id});
//     };

//     @Query(() => [Picture])
//     async returnAllPicture(){
//       return await PictureModel.find();
//     };

//     @Mutation(() => Picture)
//     async createPicture(@Arg("data"){name,description,link}: PictureInput): Promise<Picture> { 
//       const Picture = (await PictureModel.create({      
//           name,
//           description,
//           color,
//           stock,
//           price,
//          category_id   
//       })).save();
//       return Picture;
//     };

//    @Mutation(() => Boolean)
//    async deletePicture(@Arg("id") id: string) {
//     await PictureModel.deleteOne({id});
//     return true;
//   }

//   @FieldResolver(_type => (Categories))
//   async category(@Root() Picture: Picture): Promise<Categories> {
//     console.log(Picture, "Picture!")
//     return (await CategoriesModel.findById(Picture._doc.category_id))!;
//   }
// }