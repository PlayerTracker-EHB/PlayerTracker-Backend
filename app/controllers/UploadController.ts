import { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload_service'
import { inject } from '@adonisjs/core'


@inject()
export default class UploadsController {
  constructor(protected uploadService: UploadService) { }

  async uploadChunk({ request, response }: HttpContext) {
    const chunk = request.file('chunk', {
      size: '1gb',
      extnames: ['mp4', 'mkv', 'avi', 'mov', 'wmv']
    })

    if (!chunk) {
      return response.badRequest({ error: 'No chunk provided' })
    }


    const { name, chunkIndex } = request.body()

    // Only validate first chunk
    if (Number(chunkIndex) === 0) {
      if (!chunk?.isValid) {
        console.error("Invalid file type:", chunk?.errors)
        return response.badRequest({
          error: 'Invalid file type',
          details: chunk?.errors
        })
      }
    }

    try {
      await this.uploadService.handleChunkUpload(chunk, name, Number(chunkIndex))
      return response.ok({ message: 'Chunk uploaded successfully' })
    } catch (error) {
      return response.internalServerError({
        error: 'Failed to upload chunk',
        details: error.message
      })
    }
  }

  async finalizeUpload({ request, response }: HttpContext) {
    const { name, totalChunks } = request.body()
    console.log("Finalizing upload for:", name, "Total Chunks:", totalChunks)
    try {
      await this.uploadService.combineAndStoreFile(name, parseInt(totalChunks))
      return response.ok({ message: 'Upload finalized successfully' })
    } catch (error) {
      return response.internalServerError({
        error: 'Failed to finalize upload',
        details: error.message
      })
    }
  }
}

