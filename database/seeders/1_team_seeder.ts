import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Team from '#models/team'

export default class TeamSeeder extends BaseSeeder {
  async run() {
    await Team.createMany([
      {
        coachName: 'Coach John',
        clubName: 'Futsal Warriors',
      },
      {
        coachName: 'Coach Lisa',
        clubName: 'Futsal Titans',
      },
    ])
  }
}
