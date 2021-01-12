import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
} from 'type-graphql'
import { Picture, PictureModel } from '../entities/Picture'
import { UserModel } from '../entities/Users'
import { PictureInput } from './types/Picture-input'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/MyContext'

@Resolver((_of) => Picture)
export class PictureResolver {
    @Query((_returns) => Picture, { nullable: false })
    async returnSinglePicture(@Arg('id') id: string) {
        return await PictureModel.findById({ _id: id })
    }

    @Query(() => [Picture])
    async returnAllPictures(): Promise<Picture[] | null> {
        const picture = await PictureModel.find()
        for (let i = 0; i < picture.length; i++) {
            await picture[i].populate('uploader').execPopulate()
        }
        return picture
    }

    @Query(() => [Picture])
    @UseMiddleware(isAuth)
    async returnCurrentUserPictures(
        @Ctx() ctx: MyContext
    ): Promise<Picture[] | null> {
        const picture = await PictureModel.find({
            uploader: ctx.req.session.userId,
        })
        return picture
    }

    @Mutation(() => Picture)
    @UseMiddleware(isAuth)
    async createPicture(
        @Arg('data') { name, description, link, publicVisible }: PictureInput,
        @Arg('tags', () => [String]) tags: String[],
        @Ctx() ctx: MyContext
    ): Promise<Picture> {
        console.log(ctx.req.session.userId)
        const user = await UserModel.findOne({ _id: ctx.req.session.userId })
        const uploadDate = new Date()
        const picture = await PictureModel.create({
            name,
            description,
            link,
            uploadDate,
            publicVisible,
            tags,
            uploader: user!._id,
        })
        await picture.save()

        await picture.populate('uploader').execPopulate()
        return picture
    }

    @Mutation(() => Boolean)
    async deletePicture(@Arg('id') id: string) {
        await PictureModel.deleteOne({ id })
        return true
    }

    //   @FieldResolver(_type => (Categories))
    //   async category(@Root() Picture: Picture): Promise<Categories> {
    //     console.log(Picture, "Picture!")
    //     return (await CategoriesModel.findById(Picture._doc.category_id))!;
    //   }
}
