import { OAuth2Client } from 'google-auth-library'
import cors from '@fastify/cors'
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
})

fastify.register(cors, {
  origin: '*',
})

const isDevelopmentEnv = process.env.NODE_ENV === 'development'

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  'postmessage',
)

fastify.get('/', async () => {
  return { hello: 'world' }
})

const convertUnixEpochToDate = (value: number) => new Date(value * 1000)
const verifyDateIsOld = (targetDate: Date, baseDate = new Date(Date.now())) => {
  return targetDate < baseDate
}

const loadGoogleProfile = async (accessToken: string): Promise<Record<string, string> | unknown> => {
  if (!accessToken) {
    return undefined
  }

  // {
  //   issued_to: '936997008152-kagqv1ocamu2hv599ok9d9a055mebb2f.apps.googleusercontent.com',
  //   audience: '936997008152-kagqv1ocamu2hv599ok9d9a055mebb2f.apps.googleusercontent.com',
  //   user_id: '113646098390079903948',
  //   scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
  //   expires_in: 3599,
  //   email: 'lucas.eufrasio@jcpm.com.br',
  //   verified_email: true,
  //   access_type: 'offline'
  // }
  performance.mark('profile-start');
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
  performance.mark('profile-end');
  const measureResult = performance.measure('profile', 'profile-start', 'profile-end');

  console.log('measure result', measureResult)
  

  const result = await response.json()

  return result
}

fastify.post('/auth/google/verify', async (request, reply) => {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: request.headers.token as string,
    })

    const payload = ticket.getPayload()
    const isAnOldDate = verifyDateIsOld(convertUnixEpochToDate(payload?.exp || 0))

    if (isDevelopmentEnv) {
      fastify.log.info('ticket', ticket)
      fastify.log.info('isAnOldDate', isAnOldDate)
    }

    if (isAnOldDate) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    return { ok: true }
  } catch (error) {
    fastify.log.error(error)
    return reply.status(401).send({ message: 'Unauthorized' })
  }
})

fastify.post('/auth/google', async (request: any, reply) => {
  try {
    const { tokens } = await oAuth2Client.getToken(request.body.code)
    
    if (isDevelopmentEnv) {
      fastify.log.info(tokens)
    }

    if (tokens.access_token?.length && !Array.isArray(tokens.access_token)) {
      const profile = await loadGoogleProfile(tokens.access_token)

      console.log('user profile', profile)
    }

    return tokens
  } catch (error) {
    fastify.log.error(error)
    return { message: 'Unexpected Error' }
  }
})


fastify.get('/auth/google/profile', async (request, reply) => {
  try {
    const authorization = request.headers['authorization']
    const token = authorization?.split(" ")

    if (!token) {
      return reply.status(401).send({ message: 'You shall not pass' })
    }
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
    

    const result = await response.json()

    if (isDevelopmentEnv) {
      fastify.log.info(result)
    }

    return result
  } catch (error) {
    fastify.log.error(error)
    return { message: 'Unexpected Error' }
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 9798, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
