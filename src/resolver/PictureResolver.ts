import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
} from 'type-graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Picture, PictureModel } from '../entities/Picture'
import { UserModel } from '../entities/Users'
import { PictureInput } from './input-types/PictureInput'
import { UploadPictureInput } from './input-types/UploadPictureInput'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/MyContext'
import { createWriteStream, unlink } from 'fs'
import { uploadandGetURL } from '../utils/utilAWS'

import dotenv from 'dotenv'
dotenv.config()

@Resolver((_of) => Picture)
export class PictureResolver {
    @Query((_returns) => Picture, { nullable: false })
    async returnSinglePicture(@Arg('id') id: string) {
        return await PictureModel.findById({ _id: id })
    }

    @Mutation(() => Picture)
    async uploadPictureFile(
        @Arg('data')
        { name, description, publicVisible }: UploadPictureInput,
        @Arg('tags', () => [String]) tags: String[],
        @Ctx() ctx: MyContext,
        @Arg('image', () => GraphQLUpload)
        { createReadStream, filename }: FileUpload
    ): Promise<Picture | null> {
        const filepath = `${__dirname}\\${filename}`
        let picture = await PictureModel.create()
        await new Promise((resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(filepath))
                .on('finish', async () => {
                    return resolve(true)
                })
                .on('error', () => {
                    return reject(true)
                })
        })
        const link = await uploadandGetURL(
            filepath,
            `${Date.now()}-${filename}`
        )
        if (!link) {
            return null
        }
        const user = await UserModel.findOne({
            _id: ctx.req.session.userId,
        })

        const uploadDate = new Date()
        picture = await PictureModel.create({
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
        await unlink(filepath, () => {})
        return picture
    }

    @Mutation(() => Picture)
    @UseMiddleware(isAuth)
    async createPicture(
        @Arg('data') { name, description, link, publicVisible }: PictureInput,
        @Arg('tags', () => [String]) tags: String[],
        @Ctx() ctx: MyContext
    ): Promise<Picture> {
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
    @UseMiddleware(isAuth)
    async deletePicture(@Arg('id') id: string, @Ctx() ctx: MyContext) {
        const picture = await PictureModel.findById({ _id: id })
        if (!picture) {
            return false
        }

        if (picture!.uploader == ctx.req.session.userId) {
            await PictureModel.deleteOne({ _id: id })
            return true
        }

        return false
    }
}
