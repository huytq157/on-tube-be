import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Youtube API',
      version: '1.0.0',
      description: 'API Documentation for my project',
    },
    servers: [
      {
        url: process.env.SWAGGER_URL_PRODUCTION,
      },
      {
        url: process.env.SWAGGER_URL_DEVELOPMENT,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routers/*.ts', './src/models/*.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}
