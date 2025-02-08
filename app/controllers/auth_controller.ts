import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class AuthController {
  public async register({ request, response, auth }: HttpContext) {
    const data = request.only(['email', 'password', 'fullName'])

    const user = await User.create(data)
    await auth.use('web').login(user)

    return response.ok({ user, message: 'User registered successfully' })
  }

  public async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      return response.ok({ user, message: 'Login successful' })
    } catch (error) {
      console.error('login-error:', error)
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }

  public async me({ auth, response }: HttpContext) {
    return response.ok({ user: auth.user })
  }
}
