import GameStats from '#models/game_stats';
import { StatsService } from '#services/stats_service';
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const gameSchema = vine.compile(
  vine.object({
    gameId: vine.number(),
    videoName: vine.string(),
    possessionTeamA: vine.string(),
    possessionTeamB: vine.string(),
    heatmapTeamA: vine.string(),
    heatmapTeamB: vine.string(),
  })
)

@inject()
export default class AIController {
  constructor(protected statsService: StatsService) { }

  public async handle({ request, response }: HttpContext) {
    const data = request.only(["gameId", "videoName", "possessionTeamA", "possessionTeamB", "heatmapTeamA", "heatmapTeamB"]);

    const payload = await gameSchema.validate(data);

    const gameStats = new GameStats();

    gameStats.gameId = payload.gameId;
    gameStats.videoName = payload.videoName;
    gameStats.possessionTeamA = payload.possessionTeamA;
    gameStats.possessionTeamB = payload.possessionTeamB;
    gameStats.heatmapTeamA = payload.heatmapTeamA;
    gameStats.heatmapTeamB = payload.heatmapTeamB;

    this.statsService.handleStats(gameStats)


    response.ok("Stats received successfully")
  }

}
