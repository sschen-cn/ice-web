const tip = '我的卡丽熙，欢迎来到河间地\n' + 
  '点击<a href="http://sschenweb.com">一起搞事情吧</a>'

export default async (ctx, next) => {
  const message = ctx.weixin
  console.log(message)
  let mp = require('../wechat')
  let client = mp.getWechat()

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.count + ' photo sent'
    }
  } else if (message.MsgType === 'text') {
    if (message.Content === '1') {
      let userList = [
        {
          openid : 'oh8mqt5HmfJ6TAueQx-hH0IZDjn4',
          lang: 'zh_CN'
        }
      ]

      // const data = await client.handle('createTag', 'VueSSR')
      const data = await client.handle('fetchTags')
      // const data = await client.handle('batchTag', ['oh8mqt5HmfJ6TAueQx-hH0IZDjn4'], 100)
      // const data = await client.handle('getTagList', 'oh8mqt5HmfJ6TAueQx-hH0IZDjn4')
      console.log(data)
    } else if (message.Content === '2') {
      const menu = require('./menu').default
      const menuData = await client.handle('createMenu', menu)
      console.log(menuData)
    }

    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      title: message.ThumbMediaId,
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ':' + message.Location_Y + ':' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/8LLn87JwKdnJeNKbD0t14qZGXlY3FKLicEicvX1wnh9nurxmAGsvZWYic9MgoamoeU7vu205f10hINEksIgc5b3kw/0',
      url: message.Url
    }]
  }
}