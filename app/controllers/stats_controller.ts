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
}

