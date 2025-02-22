import GameStats from "#models/game_stats"
import { inject } from "@adonisjs/core"
import { MinioService } from "./minio_service.js"

@inject()
export class StatsService {
  constructor(
    protected minioService: MinioService
  ) { }
  async handleStats(stats: GameStats) {
    stats.save()
    const videoBucket = "processed-videos"
    const heatmapBucket = "heatmaps"
    this.minioService.downloadFile(stats.videoName, videoBucket)
    this.minioService.downloadFile(stats.heatmapTeamA, heatmapBucket)
    this.minioService.downloadFile(stats.heatmapTeamB, heatmapBucket)


  }

}
