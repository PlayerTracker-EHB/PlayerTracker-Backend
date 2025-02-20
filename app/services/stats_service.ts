import GameStats from "#models/game_stats"

export class StatsService {
  async handleStats(stats: GameStats) {
    stats.save()
  }

}
