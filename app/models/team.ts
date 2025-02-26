import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Player from '#models/player'
import Game from '#models/game'
import { type HasMany } from '@adonisjs/lucid/types/relations'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare teamId: number

  @column()
  declare coachName: string | null

  @column()
  declare clubName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Player)
  declare players: HasMany<typeof Player>

  @hasMany(() => Game)
  declare games: HasMany<typeof Game>
}

