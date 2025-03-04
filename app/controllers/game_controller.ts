import { GameService } from "#services/game_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";


@inject()
export default class GameController {
  constructor(
    public gameService: GameService,
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
    console.log("downloadProcessedVideo")
    const gameId = request.param('matchId')
    const gameStats = await this.gameService.getStats(gameId)

    const bucket = 'processed-videos'
    const sourceObject = gameStats.videoName
    const filePath = app.makePath("storage", bucket, sourceObject)

    response.download(filePath)
  }


}
