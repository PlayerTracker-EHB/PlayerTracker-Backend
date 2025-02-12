import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Team from '#models/team'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

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
  declare videoPath: string | null

  @belongsTo(() => Team)
  declare teamData: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

