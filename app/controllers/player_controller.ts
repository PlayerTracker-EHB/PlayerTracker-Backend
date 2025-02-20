import { PlayerService } from "#services/player_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from '@vinejs/vine'

const playerSchema = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    teamId: vine.number(),
  })
)

@inject()
export default class PlayerController {
  constructor(
    public playerService: PlayerService,
  ) { }


  public async index({ auth }: HttpContext) {

    const teamId = auth.user?.teamId

    return await this.playerService.all(teamId)
  }


  public async create({ request, response }: HttpContext) {

    const data = request.only(["firstName", "lastName", "teamId"])

    const payload = await playerSchema.validate(data)

    const player = await this.playerService.create(payload)

    return response.ok({ player, message: "Player created successfully" })
  }

  public async update({ request, response }: HttpContext) {

    const playerID = request.param('playerId')
    const data = request.only(["firstName", "lastName"])

    const player = await this.playerService.update(playerID, data)

    return response.ok({ player, message: "Player updated successfully" })
  }


  public async delete({ request, response }: HttpContext) {
    const playerID = request.param('playerId')

    await this.playerService.delete(playerID)

    return response.ok({ messages: "Player deleted successfully" })
  }
}
