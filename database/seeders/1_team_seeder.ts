import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Team from '#models/team'

export default class TeamSeeder extends BaseSeeder {
  async run() {
    await Team.createMany([
      {
        coachName: 'Coach John',
        clubName: 'Futsal Warriors',
        teamLogoUrl: 'https://example.com/futsal_warriors_logo.png',
      },
      {
        coachName: 'Coach Lisa',
        clubName: 'Futsal Titans',
        teamLogoUrl: 'https://example.com/futsal_titans_logo.png',
      },
    ])
  }
}
