import Game from "#models/game"
import { inject } from "@adonisjs/core"

@inject()
export class GameService {
  async all(teamId: any) {
    const Games = await Game.query().where('teamId', teamId)
    return Games
  }

  async create(game: any) {
    return await Game.create(game)
  }

}

