import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Team from '#models/team'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { GameStatus } from '../enums/game_status.js'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare gameId: number

  @column()
  declare teamId: number

  @column()
  declare atHome: boolean

  @column()
  declare adversaryName: string

  @column()
  declare gameDate: Date

  @column()
  declare videoPath: string | null

  @column()
  declare homeTeamScore: number

  @column()
  declare awayTeamScore: number

  @column()
  declare gameStatus: GameStatus

  @column()
  declare startsLeft: boolean

  @belongsTo(() => Team)
  declare teamData: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

