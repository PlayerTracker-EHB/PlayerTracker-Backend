import User from "#models/user";
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

const userSchema = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: vine.string(),
    password: vine.string(),
    teamId: vine.number(),
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

  public async getUsers({ request }: HttpContext) {
    const teamId = request.param('teamId')
    const users = await this.teamService.getUsers(teamId)

    return users
  }

  public async createUser({ request, response }: HttpContext) {
    console.log("TEST");

    const data = request.only(["fullName", "email", "password", "teamId"]);
    console.log("DATA", data);

    try {
      const validatedData = await userSchema.validate(data);
      const user = await User.create(validatedData);
      return response.ok({ user, message: "User created successfully" });
    } catch (error) {
      console.error("Validation error:", error);
      return response.badRequest({ message: "Validation failed", error: error.message });
    }
  }


  public async deleteUser({ request, response }: HttpContext) {
    const userId = request.param('userId')

    const user = await User.findOrFail(userId)
    await user.delete()

    return response.ok({ message: "User deleted successfully" })
  }
}

