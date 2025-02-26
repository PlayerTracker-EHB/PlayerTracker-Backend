import Team from "#models/team";

export interface teamRequest {
  teamId: number,
  coachName: string,
  clubName: string,
}

export class TeamService {

  async update(team: teamRequest) {
    const oldTeam = await Team.findOrFail(team.teamId)
    const updatedTeam = await oldTeam.merge(team).save()
    console.log(updatedTeam)
    return updatedTeam
  }

}
