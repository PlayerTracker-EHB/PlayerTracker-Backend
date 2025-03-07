import { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload_service'
import Game from '#models/game'
import vine from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import { GameService } from '#services/game_service'
import { MinioService } from '#services/minio_service'

const gameSchema = vine.compile(
  vine.object({
    name: vine.string(),
    totalChunks: vine.number(),
    atHome: vine.boolean(),
    adversaryName: vine.string(),
    gameDate: vine.date(),
    homeTeamScore: vine.number(),
    awayTeamScore: vine.number(),
    startsLeft: vine.boolean()
  })
)

@inject()
export default class UploadsController {
  constructor(
    protected uploadService: UploadService,
    protected gameService: GameService,
    protected minioService: MinioService
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
      console.log("I AM HERE")
      await this.uploadService.handleChunkUpload(chunk, name, Number(chunkIndex));
      console.log("I AM HERE TOO")
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

    const data = request.only(["name", "totalChunks", "atHome", "adversaryName", "gameDate","homeTeamScore","awayTeamScore","startsLeft"]);
    console.log(data)

    try {
      const payload = await gameSchema.validate(data);
      console.log(payload)

      const teamId = auth.user?.teamId

      if (!teamId) {
        return response.unauthorized({ error: 'Unauthorized' });
      }

      const game = new Game();
      game.teamId = teamId;
      game.atHome = payload.atHome;
      game.adversaryName = payload.adversaryName;
      game.gameDate = payload.gameDate;
      game.homeTeamScore = payload.homeTeamScore;
      game.awayTeamScore = payload.awayTeamScore;
      game.startsLeft = payload.startsLeft;

      const array = await this.uploadService.combineAndStoreFile(payload.name, payload.totalChunks);

      game.videoPath = array[0];
      const destinationObject = array[1]

      const gameId = await this.gameService.create(game)

      this.minioService.uploadFile(destinationObject, gameId)
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

