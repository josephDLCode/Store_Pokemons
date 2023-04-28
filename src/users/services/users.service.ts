import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose'
import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'
import { User } from '../entities/user.entity'
import { Model } from 'mongoose'
import { ImagesService } from 'src/images/images.service'
import { AuthService } from 'src/auth/services/auth.service'

@Injectable()
export class UsersService {
  constructor (
    @InjectModel(User.name) private usersModel: Model<User>,
    private imagesService: ImagesService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) {}
  findAll () {
    return this.usersModel.find().exec()
  }

  async findOne (id: string) {
    const user = await this.usersModel.findById(id).exec()
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return user
  }

  findByEmail (email: string) {
    return this.usersModel.findOne({ email }).exec()
  }

  async create (payload: CreateUserDto, photo?: Express.Multer.File) {
    const avatarUrl = {}
    try {
      if (photo) {
        const result = await this.imagesService.uploadImage(photo)
        avatarUrl['url'] = result.url
        avatarUrl['public_id'] = result.public_id
      }
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(payload.password, salt)
      payload.password = hashedPassword
      const newUser = new this.usersModel({
        ...payload,
        avatarUrl: Object.keys(avatarUrl).length ? avatarUrl : null
      })

      const userSaved = await newUser.save()
      const { password, ...userSavedRest } = userSaved.toJSON()
      const userAccessToken = this.authService.generateJWT(
        userSavedRest as User
      )
      return userAccessToken
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update (
    id: string,
    payload: UpdateUserDto,
    photo?: Express.Multer.File
  ) {
    const userData = { ...payload }
    const user = await this.findOne(id)
    try {
      if (photo) {
        if (user.avatarUrl === null) {
          const result = await this.imagesService.uploadImage(photo)
          userData['avatarUrl'] = {
            url: result.url,
            public_id: result.public_id
          }
        } else {
          const result = await this.imagesService.updateImage(
            user.avatarUrl.public_id,
            photo
          )
          userData['avatarUrl'] = {
            url: result.url,
            public_id: result.public_id
          }
        }
      }

      if (payload.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(payload.password, salt)
        payload.password = hashedPassword
      }

      const updatedUser = this.usersModel.findByIdAndUpdate(
        id,
        {
          $set: { ...userData }
        },
        { new: true }
      )
      return updatedUser
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove (id: string) {
    const user = await this.findOne(id)
    if (user.avatarUrl && Object.keys(user.avatarUrl).length) {
      await this.imagesService.deleteImage(user.avatarUrl.public_id)
    }
    return this.usersModel.findByIdAndDelete(id)
  }
}
