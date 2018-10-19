import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import config from '../config'
import R from 'ramda'

const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))

const formatData = R.map(i => {
  i._id = i.nmId

  return i
})

let wikiCharacters = require(resolve(__dirname, '../database/json/completeCharacters.json'))
let wikiHouses = require(resolve(__dirname, '../database/json/completeHouses.json'))

wikiCharacters = formatData(wikiCharacters)

export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconected', () => {
    mongoose.connect(config.db)
  })
  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Connected to MongoDB ', config.db)

    const WikiHouse = mongoose.model('WikiHouse')
    const WikiCharacter = mongoose.model('WikiCharacter')
    const User = mongoose.model('User')

    const existWikiHouses = await WikiHouse.find({}).exec()
    const existWikiCharacters = await WikiCharacter.find({}).exec()

    if (!existWikiHouses.length) WikiHouse.insertMany(wikiHouses)
      if (!existWikiCharacters.length) WikiCharacter.insertMany(wikiCharacters)

    let user = await User.findOne({
      email: 'sschen_cn@163.com'
    }).exec()

    if (!user) {
      console.log('写入管理员数据')
      user = new User({
        email: 'sschen_cn@163.com',
        password: 'c13762108575',
        role: 'admin'
      })
      await user.save()
    }
  })
}