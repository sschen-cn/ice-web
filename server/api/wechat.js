import mongoose from 'mongoose'
import { getWechat, getOAuth } from '../wechat'

const User = mongoose.model('User')

const client = getWechat()

export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID
  
  return params
}

export function getAuthorizeURL (...args) {
  const ouath = getOAuth()

  return ouath.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const ouath = getOAuth()
  const data = await ouath.fetchAccessToken(code)
  console.log(data)
  // const user = await ouath.getUserInfo(data.access_token, data.unionid)
  const user = await ouath.getUserInfo(data.access_token, data.openid)
  console.log(user)
  const existUser = await User.findOne({
    openid: data.openid
  }).exec()

  console.log('existUser')
  console.log(existUser)

  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      nickname: user.nickname,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgurl: user.headimgurl,
      sex: user.sex
    })
    await newUser.save()
  }

  return {
    nickname: user.nickname,
    province: user.province,
    country: user.country,
    city: user.city,
    openid: user.openid,
    headimgurl: user.headimgurl,
    sex: user.sex
  }
}