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
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/MyContext'
import AWS from 'aws-sdk'
// import { Stream } from 'stream'
import { createWriteStream, readFileSync } from 'fs'
// import { PutObjectRequest } from 'aws-sdk/clients/s3'

import dotenv from 'dotenv'
dotenv.config()

// let uploadFromStream = (s3: any, key: string) => {
//     var pass = new Stream.PassThrough()

//     var params = { Bucket: process.env.BUCKET, Key: key, Body: pass }
//     return s3
//         .upload(params, function (err: any, data: any) {
//             console.log(err, data)
//         })
//         .promise()
// }

@Resolver((_of) => Picture)
export class PictureResolver {
    @Query((_returns) => Picture, { nullable: false })
    async returnSinglePicture(@Arg('id') id: string) {
        return await PictureModel.findById({ _id: id })
    }

    @Mutation(() => Boolean)
    async uploadPicture(
        //@Arg('data') { name, description, link, publicVisible }: PictureInput,
        //@Arg('tags', () => [String]) tags: String[],
        @Arg('image', () => GraphQLUpload)
        { createReadStream, filename }: FileUpload
    ): Promise<Boolean> {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.AWS_SECRET_KEY as string,
            region: process.env.AWS_REGION as string,
        })
        const s3 = new AWS.S3()

        // const test = createReadStream()._read
        // const chunks: Buffer = []
        // for await (let chunk of readable) {
        //     chunks.push(chunk)
        // }
        // Buffer.concat(chunks)

        // var params = {
        //     Bucket: process.env.BUCKET,
        //     Key: `${new Date()}-${filename}`,
        //     Body: chunks,
        // }
        // let model = await s3.upload(params).promise()
        // // const user = await UserModel.findOne({ _id: ctx.req.session.userId })
        // // const uploadDate = new Date()
        // // const picture = await PictureModel.create({
        // //     name,
        // //     description,
        // //     link,
        // //     uploadDate,
        // //     publicVisible,
        // //     tags,
        // //     uploader: user!._id,
        // // })
        // // await picture.save()

        // // await picture.populate('uploader').execPopulate()
        // // return picture
        // return true
        // console.log(createReadStream())
        const filepath = `${__dirname}\\images\\${filename}`
        console.log(filepath)
        createReadStream()
            .pipe(createWriteStream(filepath))
            .on('finish', async () => {
                const fileContent = readFileSync(filepath)

                const ye = `${Date.now()}-${filename}`
                const params = {
                    Bucket: process.env.S3_BUCKET as string,
                    Key: ye, // File name you want to save as in S3
                    Body: fileContent,
                }

                const response = await s3.upload(params).promise()
                console.log(response)

                const params2 = {
                    Bucket: process.env.S3_BUCKET as string,
                    Key: ye, // File name you want to save as in S3
                    Expires: 60 * 5,
                }

                const url = await new Promise((resolve, reject) => {
                    s3.getSignedUrl('getObject', params2, (err, url) => {
                        err ? reject(err) : resolve(url)
                    })
                })
                console.log(url)
            })
            .on('error', () => {
                return false
            })

        return false
        // if (written) {
        //     readFile(
        //         `${__dirname}\\images\\${filename}`,
        //         function (_err, data) {
        //             let params = {
        //                 Bucket: process.env.S3_BUCKET,
        //                 Key: Date.now() + '_' + filename,
        //                 Body: data,
        //             }
        //             s3.upload(params, function (_err, data) {
        //                 response.send(200, { key: data.key })
        //             })
        //         }
        //     )
        // }
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
