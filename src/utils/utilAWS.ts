import AWS from 'aws-sdk'
import { readFileSync } from 'fs'

import dotenv from 'dotenv'
dotenv.config()

export const uploadandGetURL = async (
    filepath: string,
    keyname: string
): Promise<string | null> => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
        region: process.env.AWS_REGION as string,
    })
    const s3 = new AWS.S3()

    const fileContent = readFileSync(filepath)

    const upload_params = {
        Bucket: process.env.S3_BUCKET as string,
        Key: keyname,
        Body: fileContent,
    }

    await s3.upload(upload_params).promise()

    const url_params = {
        Bucket: process.env.S3_BUCKET as string,
        Key: keyname,
        Expires: 60 * 5,
    }

    const url: string = await new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', url_params, (err, url) => {
            err ? reject(err) : resolve(url)
        })
    })

    return url
}
