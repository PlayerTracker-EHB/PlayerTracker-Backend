import GameStats from "#models/game_stats"
import { inject } from "@adonisjs/core"
import { MinioService } from "./minio_service.js"
import { GameService } from "./game_service.js"
import { GameStatus } from "../enums/game_status.js"

@inject()
export class StatsService {
  constructor(
    protected minioService: MinioService,
    protected gameService: GameService,
  ) { }

  async getStats(gameId: number) {
    const gameStats = await GameStats.findByOrFail("gameId", gameId)
    return gameStats
  }

  async handleStats(stats: GameStats) {
    stats.save()

    this.gameService.updateStatus(stats.gameId, GameStatus.COMPLETED)

    const videoBucket = "processed-videos"
    const heatmapBucket = "heatmaps"
    this.minioService.downloadFile(stats.videoName, videoBucket)
    this.minioService.downloadFile(stats.heatmapTeamA, heatmapBucket)
    this.minioService.downloadFile(stats.heatmapTeamB, heatmapBucket)


  }

}
