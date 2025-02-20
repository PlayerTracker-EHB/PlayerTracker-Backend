import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_stats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('stat_id').primary()
      table.integer('game_id').unsigned().references('games.game_id').onDelete('CASCADE')
      table.string('video_name').notNullable()
      table.string('possession_team_a').notNullable()
      table.string('possession_team_b').notNullable()
      table.string('heatmap_team_a').notNullable()
      table.string('heatmap_team_b').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

