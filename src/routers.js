import authRouter from './routers/auth.js'
import scriptRouter from './routers/script.js'
import { app } from './globals/index.js'

export const useRouters = () => {
  app.use('', authRouter())
  app.use('', scriptRouter())
}
