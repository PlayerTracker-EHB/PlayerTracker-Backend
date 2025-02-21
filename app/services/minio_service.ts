import * as Minio from 'minio'

import minio from '#config/minio'
import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'

@inject()
export class MinioService {
  private client: Minio.Client

  constructor() {

    this.client = new Minio.Client({
      endPoint: minio.endpoint,
      port: minio.port,
      useSSL: minio.useSSL,
      accessKey: minio.accessKey,
      secretKey: minio.secretKey,
    })
  }

  // Upload video to MinIO
  public async uploadFile(destinationObject: string, matchId: number): Promise<void> {
    const bucket = minio.bucketName
    const filePath = app.makePath("storage/videos", destinationObject)

    // Check if the bucket exists
    const exists = await this.client.bucketExists(bucket)
    if (!exists) {
      await this.client.makeBucket(bucket, 'us-east-1')
    }

    // Set metadata for the file
    const metaData = {
      'Content-Type': 'video/mp4',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    }

    // Upload the file to the bucket
    await this.client.fPutObject(bucket, destinationObject, filePath, metaData)
    this.sendFileData(destinationObject, matchId)
    console.log(`File ${filePath} uploaded as object ${destinationObject} in bucket ${bucket}`)
  }

  // Download video from MinIO
  public async downloadFile(sourceObject: string, bucket: string): Promise<void> {
    const filePath = app.makePath("storage", bucket, sourceObject)

    this.client.fGetObject(bucket, sourceObject, filePath)

  }



  private async sendFileData(filename: string, gameId: number): Promise<void> {
    const uniqueFileName = Date.now().toString() + filename;

    const url = new URL('http://localhost:3333/upload');

    console.log("url", url)
    console.log("filename", uniqueFileName)
    console.log("matchId", gameId)

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uniqueFileName,
          gameId: gameId
        })

      });

      if (!response.ok) {
        throw new Error(`HTTP error when sending to ai! status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse the JSON response
      console.log('Success:', responseData); // Handle the success response
    } catch (error) {
      console.error('Error:', error); // Handle errors
    }
  }

}


export default new MinioService()

