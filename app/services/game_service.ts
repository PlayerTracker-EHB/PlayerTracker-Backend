import Game from "#models/game"
import { inject } from "@adonisjs/core"

@inject()
export class GameService {
  async all(teamId: any) {
    const Games = await Game.query().where('teamId', teamId)
    return Games
  }

  async create(game: any) {
    const createdGame = await Game.create(game)
    return createdGame.gameId
  }

  async getStatus(gameId: any) {
    const game = await Game.findByOrFail("gameId", gameId)
    console.log(game.gameStatus)

    return game.gameStatus
  }

  async updateStatus(gameId: any, status: any) {
    Game.updateOrCreate({ gameId }, { gameStatus: status })
  }


}

