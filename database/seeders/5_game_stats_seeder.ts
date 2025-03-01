import GameStats from '#models/game_stats'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class GameSeeder extends BaseSeeder {
  async run() {
    await GameStats.createMany([
      {
        gameId: 1,
        videoName: "/uploads/match1.mp4",
        possessionTeamA: 65,
        possessionTeamB: 35,
        heatmapTeamA: "/uploads/heatmap1.png",
        heatmapTeamB: "/uploads/heatmap2.png",
      },
      {
        gameId: 3,
        videoName: "/uploads/match1.mp4",
        possessionTeamA: 85,
        possessionTeamB: 15,
        heatmapTeamA: "/uploads/heatmap1.png",
        heatmapTeamB: "/uploads/heatmap2.png",
      },
    ])
  }
}

