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
import PlayersController from '#controllers/players_controller'
import UploadsController from '#controllers/UploadController'


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
  router.get("/players", [PlayersController, 'index'])
  router.post("/players", [PlayersController, 'create'])
  router.put("/players/:playerId", [PlayersController, "update"])
  router.delete("/players/:playerId", [PlayersController, 'delete'])


  router.post("/upload-chunk", [UploadsController, 'uploadChunk'])
  router.post("/finalize-upload", [UploadsController, 'finalizeUpload'])
})
  .prefix("/admin")
  .use([
    middleware.auth(),
    middleware.admin()
  ])
