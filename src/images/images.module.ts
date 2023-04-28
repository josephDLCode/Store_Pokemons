import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import config from 'src/config'
import { v2 as cloudinary } from 'cloudinary'
import { ImagesService } from './images.service'

@Module({
  providers: [
    ImagesService,
    {
      provide: 'CLOUDINARY',
      useFactory: async (configService: ConfigType<typeof config>) => {
        cloudinary.config({
          cloud_name: configService.cloudinary.cloud_name,
          api_key: configService.cloudinary.api_key,
          api_secret: configService.cloudinary.api_secret
        })
      },
      inject: [config.KEY]
    }
  ],
  exports: [ImagesService]
})
export class ImagesModule {}
