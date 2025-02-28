import { GameService } from "#services/game_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";


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
    const gameId = request.param('matchId')

    const status = this.gameService.getStatus(gameId)

    return status
  }



}
