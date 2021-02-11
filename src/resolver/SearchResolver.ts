import { Resolver, Arg, Query, UseMiddleware, Ctx } from 'type-graphql'
import { Picture, PictureModel } from '../entities/Picture'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/MyContext'

@Resolver((_of) => Picture)
export class SearchResolver {
    @Query((_returns) => Picture, { nullable: false })
    async returnSinglePicture(@Arg('id') id: string) {
        return await PictureModel.findById({ _id: id })
    }

    @Query(() => [Picture])
    async returnPublicPictures(): Promise<Picture[] | null> {
        let pictures = await PictureModel.find({ publicVisible: true })

        for (let i = 0; i < pictures.length; i++) {
            await pictures[i].populate('uploader').execPopulate()
        }
        return pictures
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

    @Query(() => [Picture])
    async search(
        @Arg('searchText') searchText: string
    ): Promise<Picture[] | null> {
        let pictures = await PictureModel.find({
            $text: { $search: searchText },
        })

        for (let i = 0; i < pictures.length; i++) {
            await pictures[i].populate('uploader').execPopulate()
        }
        return pictures
    }
}
