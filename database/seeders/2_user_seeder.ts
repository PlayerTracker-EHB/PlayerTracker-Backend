import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Admin User',
        email: 'admin@teamtracker.com',
        password: 'admin123',
        isAdmin: true,
        teamId: null,
      },
      {
        fullName: 'John Coach',
        email: 'coach@teamtracker.com',
        password: 'coach123',
        isAdmin: false,
        teamId: 1,
      },
      {
        fullName: 'Jane Player',
        email: 'player@teamtracker.com',
        password: 'player123',
        isAdmin: false,
        teamId: 1,
      },
    ])
  }
}
