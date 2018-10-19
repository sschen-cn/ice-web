import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
// import Agent from 'socks5-http-client/lib/Agent'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getIMDBCharacters = async () => {
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    // agentClass: Agent,
    // agentOptions: {
    //   socksHost: 'localhost',
    //   socksPort: 1080
    // },
    transform: body => cheerio.load(body)
  }

  let photos = []

  const $ = await rp(options)
  
  $('table.cast_list tr.even,tr.odd').each(function () {
    const nmIdDom = $(this).find('td:not(.class) a')
    const nmId = nmIdDom.attr('href')
    const characterDom = $(this).find('td.character').children().first()
    const name = characterDom.text()
    const chId = characterDom.attr('href')
    const playedByDom = $(this).find('td:not([class]) a')
    const playedBy = playedByDom.text().trim()

    photos.push({
      nmId,
      chId,
      name,
      playedBy
    })
  })

  console.log('共拿到 ' + photos.length + ' 条数据')
  const fn = R.compose(
    R.map(photo => {
      const reg1 = /\/name\/(.*?)\/\?ref/
      const reg2 = /\/title\/(.*?)\//
      // const reg3 = /\S+(?:\s+\S+)*/

      const match1 = photo.nmId.match(reg1)
      const match2 = photo.chId.match(reg2)
      // const match3 = photo.playedBy.match(reg3)
      photo.nmId = match1[1]
      photo.chId = match2[1]
      // photo.playedBy = match3[0]

      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId && (photo.chId !== '#'))
  )

  photos = fn(photos)

  console.log('清洗后，剩余 ' + photos.length + ' 条数据')

  writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
}

const fetchIMDbProfile = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)

  const img = $('figure.pi-item img.pi-image-thumbnail')
  let src = img.attr('src')

  return src
}

export const getIMDbProfile = async () => {
  const characters = require(resolve(__dirname, '../database/json/wikiCharacters.json'))
  console.log(characters.length)

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].profile) {
      console.log(characters[i].name)
      let name = characters[i].name.replace(/\s/g, '_')
      const url = `http://gameofthrones.wikia.com/wiki/${name}`
      console.log('正在爬取' + url)
      const src = await fetchIMDbProfile(url)
      console.log('已经爬到 ' + src)
      characters[i].profile = src
      writeFileSync(resolve(__dirname, '../database/json/imdbCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')
      await sleep(500)
    }
  }
}

const checkIMDbProfile = () => {
  const characters = require(resolve(__dirname, '../database/json/imdbCharacters.json'))

  const newCharacters = []

  characters.forEach((item) => {
    if (!item.profile) {
      newCharacters.push(item)
    } else {
      const reg = /(.*?)\/revision/
      let match = item.profile.match(reg)
      item.profile = match[1]
    }
  })
  writeFileSync(resolve(__dirname, '../database/json/validCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')
}

const fetchIMDbImages = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  let images = []

  $('div.media_index_thumb_list a img').each(function () {
    let src = $(this).attr('src')

    if (src) {
      src = src.split('_V1').shift()
      src += '_V1.jpg'
      console.log(src)
      images.push(src)
    }
  })

  return images
}

export const getIMDbImages = async () => {
  const characters = require(resolve(__dirname, '../database/json/validCharacters.json'))
  console.log(characters.length)

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `https://www.imdb.com/title/tt0944947/mediaindex?refine=${characters[i].nmId}`
      console.log('正在爬取' + characters[i].name)
      const images = await fetchIMDbImages(url)
      console.log('已经爬到 ' + images.length)
      characters[i].images = images
      writeFileSync(resolve(__dirname, '../database/json/fullCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')
      await sleep(500)
    }
  }
}

const checkName = () => {
  const characters = require(resolve(__dirname, '../database/fullCharacters.json'))
  for (let i = 0; i < characters.length; i++) {
    console.log(characters[i].name)
    characters[i].name = characters[i].name.replace(/\_/g, ' ')
    console.log(characters[i].name)
    writeFileSync(resolve(__dirname, '../database/json/fullCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')
  }
}

checkName()
