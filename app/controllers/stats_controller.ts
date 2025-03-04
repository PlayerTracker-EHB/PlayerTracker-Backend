import { StatsService } from "#services/stats_service";
import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

const statsSchema = vine.compile(
  vine.object({
    gameId: vine.number()
  })
)

@inject()
export default class StatsController {
  constructor(
    public statsService: StatsService,
  ) { }

  public async index({ request, response }: HttpContext) {
    const gameId = request.param('gameId');
    console.log("getting stats ", gameId)

    // Create an object that matches the schema
    const payload = { gameId: gameId };

    // First try-catch for validation
    try {
      const validatedPayload = await statsSchema.validate(payload);

      // Second try-catch for fetching stats
      try {
        const matchStats = await this.statsService.getStats(validatedPayload.gameId);
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
}

