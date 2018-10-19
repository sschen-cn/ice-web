import { controller, get, post, required } from '../decorator/router'
import mongoose from 'mongoose'
import config from '../config'
import { resolve } from 'path'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { signature, redirect, oauth, wechatPay } from '../controllers/wechat'
import { getParamsAsync } from '../wechat-lib/pay'

const User = mongoose.model('User')
const Product = mongoose.model('Product')
const Payment = mongoose.model('Payment')


@controller('')
export class WechatController {
  @get('/wechat-hear')
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wechat-hear')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wechat-pay')
  @required({ body: ['productId', 'name', 'phoneNumber', 'address'] })
  async createOrder (ctx, next) {
    await wechatPay(ctx, next)
  }

  @get('/wechat-signature')
  async wechatSignature (ctx, next) {
    await signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wechatRedirect (ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wechatOAuth (ctx, next) {
    await oauth(ctx, next)
  }
}
