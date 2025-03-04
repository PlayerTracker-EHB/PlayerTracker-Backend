/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const StatsController = () => import('#controllers/stats_controller')
const TeamController = () => import('#controllers/team_controller')
const AuthController = () => import('#controllers/auth_controller')
const PlayerController = () => import('#controllers/player_controller')
const GameController = () => import('#controllers/game_controller')
const UploadsController = () => import('#controllers/upload_controller')
const AIController = () => import('#controllers/ai_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'



// Auth route
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/', () => {
  return "Hello world"
})


router.group(() => {
  router.get('/me', [AuthController, 'me'])
  router.post('/logout', [AuthController, 'logout'])

  router.get('/games', [GameController, 'index'])
  router.get('/stats/:matchId', [StatsController, 'index'])
  router.get('/games/status/:matchId', [GameController, 'getStatus'])

}).use(middleware.auth())

// Admin routes
router.group(() => {
  router.get("/", () => {
    return "Admin page"
  })
  router.get("/players", [PlayerController, 'index'])
  router.post("/players", [PlayerController, 'create'])
  router.put("/players/:playerId", [PlayerController, "update"])
  router.delete("/players/:playerId", [PlayerController, 'delete'])

  router.put("/team", [TeamController, 'update'])
  router.get("/team/:teamId", [TeamController, 'getUsers'])
  router.post("/team/user", [TeamController, 'createUser'])
  router.delete("/team/user/:userId", [TeamController, 'deleteUser'])

  router.post("/upload-chunk", [UploadsController, 'uploadChunk'])
  router.post("/finalize-upload", [UploadsController, 'finalizeUpload'])
})
  .prefix("/admin")
  .use([
    middleware.auth(),
    middleware.admin()
  ])



//Ai routes
router.group(() => {
  router.post("/", [AIController, 'handle'])
}).prefix("/stats")
