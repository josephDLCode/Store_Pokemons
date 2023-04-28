import { ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  UseGuards
} from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { MongoIdPipe } from 'src/common/mongo-id.pipe'
import { UsersService } from '../services/users.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Public } from 'src/auth/decorators/public.decorator'

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Get()
  getUsers () {
    return this.usersService.findAll()
  }

  @Get(':id')
  getUser (@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOne(id)
  }

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  createUser (
    @Body() payload: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ],
        fileIsRequired: false
      })
    )
    photo: Express.Multer.File
  ) {
    return this.usersService.create(payload, photo)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  updateUser (
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ],
        fileIsRequired: false
      })
    )
    photo: Express.Multer.File
  ) {
    return this.usersService.update(id, payload, photo)
  }

  @Delete(':id')
  deleteUser (@Param('id', MongoIdPipe) id: string) {
    return this.usersService.remove(id)
  }
}
