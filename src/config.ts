import { registerAs } from '@nestjs/config'

export default registerAs('config', () => ({
  database: {
    dbname: process.env.DB_NAME,
    dbhost: process.env.DB_HOST,
    dbport: process.env.DB_PORT,
    dbuser: process.env.DB_USER,
    dbpass: process.env.DB_PASS
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  jwtSecret: process.env.JWT_SECRET
}))
