import Player from "#models/player";

export class PlayerService {
  async all(teamId: any) {
    const players = await Player.query().where('teamId', teamId)
    return players
  }

  async create(player: any) {
    return await Player.create(player)
  }

  async update(playerId: any, player: any) {
    const oldPlayer = await Player.findOrFail(playerId)
    const updatedPlayer = await oldPlayer.merge(player).save()
    console.log(updatedPlayer)
  }

  async delete(playerId: any) {
    const player = await Player.findOrFail(playerId)
    return await player.delete()
  }
}
