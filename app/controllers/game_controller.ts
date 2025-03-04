import { GameService } from "#services/game_service";
import { StatsService } from "#services/stats_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import vine from "@vinejs/vine";

const statsSchema = vine.compile(
  vine.object({
    matchId: vine.number()
  })
)

@inject()
export default class GameController {
  constructor(
    public gameService: GameService,
    public statsService: StatsService,
  ) { }


  public async index({ auth }: HttpContext) {

    const teamId = auth.user?.teamId

    return await this.gameService.all(teamId)
  }

  public async getStatus({ request }: HttpContext) {
    const gameIdString = request.param('gameId')

    const gameId = parseInt(gameIdString, 10)

    const status = this.gameService.getStatus(gameId)

    return status
  }

  public async downloadProcessedVideo({ request, response }: HttpContext) {
    const matchId = request.param('matchId');

    // Create an object that matches the schema
    const payload = { matchId: matchId };

    // First try-catch for validation
    try {
      const validatedPayload = await statsSchema.validate(payload);

      // Second try-catch for fetching stats
      try {
        const gameStats = await this.statsService.getStats(validatedPayload.matchId);
        const bucket = 'processed-videos'
        const sourceObject = gameStats.videoName
        const filePath = app.makePath("storage", bucket, sourceObject)

        response.download(filePath)
      } catch (error) {
        // Handle service errors
        return response.notFound({
          message: 'Match stats not found',
        });

      }
    } catch (error) {
      // Handle validation errors
      return response.badRequest({
        message: 'Validation failed',
        errors: error.messages,
      });

    }
  }


}
