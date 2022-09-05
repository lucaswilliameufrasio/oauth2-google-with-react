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

fastify.post('/auth/google/verify', async (request, reply) => {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: request.headers.token as string,
    })

    if (isDevelopmentEnv) {
      console.log(ticket)
    }

    const payload = ticket.getPayload()
    const isAnOldDate = verifyDateIsOld(convertUnixEpochToDate(payload?.exp || 0))

    if (isDevelopmentEnv) {
      console.log('isAnOldDate', isAnOldDate)
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
    console.log(tokens)

    return tokens
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
