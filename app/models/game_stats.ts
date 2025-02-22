import Game from '#models/game'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class GameStats extends BaseModel {
  @column({ isPrimary: true })
  declare statId: number

  @column()
  declare gameId: number

  @column()
  declare videoName: string

  @column()
  declare possessionTeamA: number

  @column()
  declare possessionTeamB: number

  @column()
  declare heatmapTeamA: string

  @column()
  declare heatmapTeamB: string

  @belongsTo(() => Game, {
    foreignKey: 'gameId', // the column on "users" table
    localKey: 'gameId',   // the column on "teams" table (the primary key is "teamId")
  })
  declare game: BelongsTo<typeof Game>



  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

