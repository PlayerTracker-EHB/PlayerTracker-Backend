import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Player from '#models/player'

export default class PlayerSeeder extends BaseSeeder {
  async run() {
    await Player.createMany([
      {
        firstName: 'Leo',
        lastName: 'Messi',
        teamId: 1,
      },
      {
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        teamId: 2,
      },
    ])
  }
}

