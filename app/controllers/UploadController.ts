import { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload_service'
import { inject } from '@adonisjs/core'

@inject()
export default class UploadsController {
  constructor(protected uploadService: UploadService) { }

  async uploadChunk({ request, response }: HttpContext) {
    const chunk = request.file('chunk')
    console.log("uploadChunk called")
    console.log("Received chunk:", chunk)

    const { name, chunkIndex } = request.body()
    console.log("Chunk details - Name:", name, "Index:", chunkIndex)

    if (!chunk) {
      console.error("No chunk provided")
      return response.badRequest({ error: 'No chunk provided' })
    }

    try {
      console.log("Starting chunk upload for:", name, "Index:", chunkIndex)
      await this.uploadService.handleChunkUpload(chunk, name, Number(chunkIndex))
      console.log("Chunk uploaded successfully for:", name, "Index:", chunkIndex)
      return response.ok({ message: 'Chunk uploaded successfully' })
    } catch (error) {
      console.error("Error during chunk upload:", error)
      return response.internalServerError({
        error: 'Failed to upload chunk',
        details: error.message
      })
    }
  }

  async finalizeUpload({ request, response }: HttpContext) {
    const { name, totalChunks } = request.body()
    console.log("finalizeUpload called")
    console.log("Finalizing upload for:", name, "Total Chunks:", totalChunks)

    try {
      console.log("Combining and storing file for:", name)
      await this.uploadService.combineAndStoreFile(name, parseInt(totalChunks))
      console.log("Upload finalized successfully for:", name)
      return response.ok({ message: 'Upload finalized successfully' })
    } catch (error) {
      console.error("Error during finalizing upload:", error)
      return response.internalServerError({
        error: 'Failed to finalize upload',
        details: error.message
      })
    }
  }
}

