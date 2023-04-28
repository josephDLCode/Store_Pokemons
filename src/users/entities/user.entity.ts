import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ type: { url: { type: String }, public_id: { type: String } } })
  avatarUrl: { url: string; public_id: string }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ type: [String], default: [] })
  favoritePokemons: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)
