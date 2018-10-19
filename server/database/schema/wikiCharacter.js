const mongoose =require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiCharacterSchema = new mongoose.Schema({
  _id: String,
  wikiId: Number,
  nmId: String,
  chId: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  images: [
    String
  ],
  sections: Mixed,
  intro: [
    String,
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

WikiCharacterSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

WikiCharacterSchema.statics = {
  async getAccessWikiCharacter() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token && token.token) {
      token.access_token = token.token
    }

    return token
  },

  async saveAccessWikiCharacter(data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new WikiCharacter({
        name: 'access_token',
        token: data.access_token,
        expires_inx: data.expires_in
      })
    }

    await token.save()

    return data
  }
}

const WikiCharacter = mongoose.model('WikiCharacter', WikiCharacterSchema)
