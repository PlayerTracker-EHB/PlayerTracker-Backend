import { TeamService } from "#services/team_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from '@vinejs/vine'


const teamSchema = vine.compile(
    vine.object({
        teamId: vine.number(),
        coachName: vine.string(),
        clubName: vine.string(),
        teamLogoUrl: vine.string(),
    })
  )

@inject()
export default class TeamsController {
  constructor(
    public teamService: TeamService,
  ) { }


public async update({ request, response}: HttpContext) {

    

    const data = request.only(["teamId","coachName", "clubName", "teamLogoUrl"])

    
    const payload = await teamSchema.validate([data])

    const team = await this.teamService.update(payload)

    return response.ok({ team, message: "Team updated successfully" })
  }

}
