import { createApplication } from './application'
import alarmModule from './api/alarm'
import localfsModule from './api/localfs'
import swaggerModule from './swagger-module'
import webFrameworkModule from './web-framework-module'

const application = createApplication({
  definition: './apis.openapi.yml'
})

application
  .use(webFrameworkModule)
  .use(swaggerModule)
  .use(alarmModule)
  .use(localfsModule)
  .start(process.env.PORT || 3000)
