import * as bcrypt from 'bcrypt'
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { UsersService } from 'src/users/services/users.service'
import { User } from 'src/users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { PayloadToken } from '../models/token.model'

@Injectable()
export class AuthService {
  constructor (
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser (email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        const { password, ...userRest } = user.toJSON()
        return userRest
      } else {
        return null
      }
    }
    return null
  }

  generateJWT (user: User) {
    const payload: PayloadToken = { email: user.email, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
      user
    }
  }

  getAuthenticatedUser (id: string) {
    return this.usersService.findOne(id)
  }
}
