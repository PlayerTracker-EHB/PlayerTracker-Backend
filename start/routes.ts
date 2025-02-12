/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const AuthController = () => import('#controllers/auth_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])
router.get('/me', [AuthController, 'me']).use(middleware.auth())
router.get('/hello', () => {
  return "Hello world"
})

router.group(() => {
  router.get("/", () => {
    return "Admin page"
  })
})
  .prefix("/admin")
  .use([
    middleware.auth(),
    middleware.admin()
  ])
