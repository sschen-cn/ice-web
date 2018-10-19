import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import R from 'ramda'
import { resolve } from 'path'

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')

const r = path => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['database', 'common', 'router']

class Server {
  constructor () {
    this.app = new Koa()
    this.useMiddleWare(this.app)(MIDDLEWARES)
  }

  useMiddleWare (app) {
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middlewares')}/${i}`
    ))
  }

  async start() {

    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    // Build in development
    if (config.dev) {
      try {
        const builder = new Builder(nuxt)
        await builder.build()
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    }

    this.app.use(async (ctx, next) => {
      ctx.status = 200
      ctx.respond = false
      ctx.req.ctx = ctx
      ctx.req.session = ctx.session
      await nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}

const app = new Server()

app.start()
