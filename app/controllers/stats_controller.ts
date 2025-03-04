import Game from "#models/game";
import { StatsService } from "#services/stats_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

const statsSchema = vine.compile(
  vine.object({
    mathiId: vine.number()
  })
)

@inject()
export default class StatsController {
  constructor(
    public statsService: StatsService,
  ) { }

  public async index({ request, response }: HttpContext) {
    const matchId = request.param('matchId');

    // Create an object that matches the schema
    const payload = { mathiId: matchId };

    // First try-catch for validation
    try {
      const validatedPayload = await statsSchema.validate(payload);

      // Second try-catch for fetching stats
      try {
        const matchStats = await this.statsService.getStats(validatedPayload.mathiId);
        return response.ok({ matchStats });
      } catch (error) {
        // Handle service errors
        return response.notFound({
          message: 'Match stats not found',
        });

      }
    } catch (error) {
      // Handle validation errors
      return response.badRequest({
        message: 'Validation failed',
        errors: error.messages,
      });

    }
  }



  public async getPossessionTrend({ params, response }: HttpContext) {
    try {
      const { teamId } = params

      const games = await Game.query()
        .where('team_id', teamId)

      const possessionData = games.map(async (game) => {
        const gameId = game.gameId
        const stats = await this.statsService.getStats(gameId)
        if (!stats) return null

        return {
          id: game.gameId,
          date: game.gameDate,
          ourScore: game.homeTeamScore,
          opponentScore: game.awayTeamScore,
          opponent: game.adversaryName,
          isHome: game.atHome,
          possession: game.startsLeft ? stats.possessionTeamA : stats.possessionTeamB,
        }
      }).filter(Boolean) // Remove null values

      return response.json(possessionData)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Error fetching possession data' })
    }
  }
}

