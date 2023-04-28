import { ConfigType } from '@nestjs/config'
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import config from 'src/config'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbhost, dbname, dbpass, dbport, dbuser } =
          configService.database
        const uri = `mongodb://${dbuser}:${dbpass}@${dbhost}:${dbport}/?authMechanism=DEFAULT`
        return {
          uri,
          user: dbuser,
          pass: dbpass,
          dbName: dbname
        }
      },
      inject: [config.KEY]
    })
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {}
