import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('game_id').primary()
      table.integer('team_id').unsigned().references('teams.team_id').onDelete('CASCADE')
      table.boolean('at_home').notNullable().defaultTo(false)
      table.string('adversary_name').notNullable()
      table.date('game_date').notNullable()
      table.text('video_path').nullable()
      table.integer('home_team_score').nullable()
      table.integer('away_team_score').nullable()
      table.boolean('starts_left').nullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

