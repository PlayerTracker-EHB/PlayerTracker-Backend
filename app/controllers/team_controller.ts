import { TeamService } from "#services/team_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from '@vinejs/vine'

const teamSchema = vine.compile(
  vine.object({
    teamId: vine.number(),
    coachName: vine.string(),
    clubName: vine.string(),
  })
)

@inject()
export default class TeamController {
  constructor(
    public teamService: TeamService,
  ) { }

  public async update({ request, response }: HttpContext) {
    // Log the incoming request data

    const data = request.only(["teamId", "coachName", "clubName"]);

    // Validate the payload
    try {
      const payload = await teamSchema.validate(data);

      // Update the team
      const team = await this.teamService.update(payload);

      return response.ok({ team, message: "Team updated successfully" });
    } catch (error) {
      console.error("Validation error:", error);
      return response.badRequest({ message: "Validation failed", error: error.message });
    }
  }

  public async getUsers({ request, response }: HttpContext) {
    const teamId = request.param('teamId')
    const users = await this.teamService.getUsers(teamId)

    return response.ok({ users, message: "Users retrieved successfully" })
  }
}

