import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Player from '#models/player'

export default class PlayerSeeder extends BaseSeeder {
  async run() {
    await Player.createMany([
      {
        firstName: 'Leo',
        lastName: 'Messi',
        team: 'Futsal Warriors',
        teamId: 1,
      },
      {
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        team: 'Futsal Titans',
        teamId: 2,
      },
    ])
  }
}

