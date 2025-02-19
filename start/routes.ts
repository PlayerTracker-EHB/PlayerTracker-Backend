/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const AuthController = () => import('#controllers/auth_controller')
const PlayersController = () => import('#controllers/players_controller')
const UploadsController = () => import('#controllers/upload_controller')
const AIController = () => import('#controllers/ai_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


// Auth route
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])
router.get('/me', [AuthController, 'me']).use(middleware.auth())

// Admin routes
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



//Ai routes
router.post("/videoname", [AIController, 'handle'])
