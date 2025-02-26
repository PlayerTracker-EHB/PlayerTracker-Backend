import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Game from '#models/game'

export default class GameSeeder extends BaseSeeder {
  async run() {
    await Game.createMany([
      {
        teamId: 1,
        atHome: true,
        adversaryName: 'Futsal Titans',
        gameDate: new Date('2022-01-01'),
        videoPath: 'https://example.com/match1.mp4',
      },
      {
        teamId: 2,
        atHome: false,
        adversaryName: 'Futsal Warriors',
        gameDate: new Date('2023-10-01'),
        videoPath: 'https://example.com/match2.mp4',
      },
    ])
  }
}

