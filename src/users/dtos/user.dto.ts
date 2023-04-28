import { Type } from 'class-transformer'
import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @Type(() => File)
  photo?: Express.Multer.File

  @IsString({ each: true })
  @IsOptional()
  favoritePokemons?: string[]
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
