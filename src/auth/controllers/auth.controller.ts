import { Request } from 'express'
import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common'

import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../services/auth.service'
import { User } from 'src/users/entities/user.entity'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { PayloadToken } from '../models/token.model'

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login (@Req() req: Request) {
    const user = req.user as User
    return this.authService.generateJWT(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('loggedUser')
  async loggedUser (@Req() req: Request) {
    const user = req.user as PayloadToken
    const foundedUser = await this.authService.getAuthenticatedUser(user.sub)
    const { password, ...authenticateUser } = foundedUser.toJSON()
    return authenticateUser
  }
}
