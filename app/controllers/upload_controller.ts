import { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload_service'
import Game from '#models/game'
import vine from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import { GameService } from '#services/game_service'

const gameSchema = vine.compile(
  vine.object({
    name: vine.string(),
    totalChunks: vine.number(),
    atHome: vine.boolean(),
    adversaryName: vine.string(),
  })
)

@inject()
export default class UploadsController {
  constructor(
    protected uploadService: UploadService,
    protected gameService: GameService
  ) { }

  async uploadChunk({ request, response }: HttpContext) {

    const chunk = request.file('chunk', {
      size: '1gb',
      extnames: ['mp4', 'mkv', 'avi', 'mov', 'wmv']
    })

    if (!chunk) {
      console.error("No chunk provided in the request");
      return response.badRequest({ error: 'No chunk provided' });
    }

    const { name, chunkIndex } = request.body();

    // Only validate first chunk
    if (Number(chunkIndex) === 0) {
      if (!chunk?.isValid) {
        console.error("Invalid file type:", chunk?.errors);
        return response.badRequest({
          error: 'Invalid file type',
          details: chunk?.errors
        });
      } else {
        console.log("First chunk is valid");
      }
    }

    try {
      await this.uploadService.handleChunkUpload(chunk, name, Number(chunkIndex));
      return response.ok({ message: 'Chunk uploaded successfully' });
    } catch (error) {
      console.error("Error during chunk upload:", error);
      return response.internalServerError({
        error: 'Failed to upload chunk',
        details: error.message
      });
    }
  }

  async finalizeUpload({ request, response, auth }: HttpContext) {
    console.log("Starting finalizeUpload method");

    const data = request.only(["name", "totalChunks", "atHome", "adversaryName"]);

    try {
      const payload = await gameSchema.validate(data);

      const teamId = auth.user?.teamId

      if (!teamId) {
        return response.unauthorized({ error: 'Unauthorized' });
      }

      const game = new Game();
      game.teamId = teamId;
      game.atHome = payload.atHome;
      game.adversaryName = payload.adversaryName;

      game.videoPath = await this.uploadService.combineAndStoreFile(payload.name, payload.totalChunks);

      this.gameService.create(game)
      return response.ok({ message: 'Upload finalized successfully' });
    } catch (error) {
      console.error("Error during finalization:", error);
      return response.internalServerError({
        error: 'Failed to finalize upload',
        details: error.message
      });
    }
  }
}

