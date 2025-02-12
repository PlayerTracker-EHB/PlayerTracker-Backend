import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Team from '#models/team'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  declare playerId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare team: string

  @column()
  declare teamId: number

  @belongsTo(() => Team)
  declare teamData: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

