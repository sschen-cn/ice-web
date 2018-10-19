const mongoose =require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiHouseSchema = new mongoose.Schema({
  name: String,
  cname: String,
  words: String,
  intro: String,
  cover: String,
  wikiId: Number,
  sections: Mixed,
  swornMembers: [
    {
      character: {
        type: String,
        ref: 'WikiCharacter'
      },
      text: String
    }
  ],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

WikiHouseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

WikiHouseSchema.statics = {
  async getAccessWikiHouse() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token && token.token) {
      token.access_token = token.token
    }

    return token
  },

  async saveAccessWikiHouse(data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new WikiHouse({
        name: 'access_token',
        token: data.access_token,
        expires_inx: data.expires_in
      })
    }

    await token.save()

    return data
  }
}

const WikiHouse = mongoose.model('WikiHouse', WikiHouseSchema)
