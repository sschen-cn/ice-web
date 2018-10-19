import Router from 'koa-router'
import config from '../config'
import { resolve } from 'path'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { signature, redirect, oauth } from '../controllers/wechat'
import Route from '../decorator/router'

const r = path => resolve(__dirname, path)

export const router = app => {
  const apiPath = r('../routes')

  const router = new Route(app, apiPath)

  router.init()
}