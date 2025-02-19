import { MinioService } from '#services/minio_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const fileNameSchema = vine.compile(
  vine.object({
    fileName: vine.string(),
  })
)

@inject()
export default class AIController {
  constructor(protected minioService: MinioService) { }
  async handle({ request, response }: HttpContext) {
    const fileName = request.only(["fileName"])
    console.log("fileName:", fileName)
    const payload = await fileNameSchema.validate(fileName)

    this.minioService.downloadFile(payload.fileName)


    response.ok({ message: "fileName received successfully" })
  }
}
