const mongoose =require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
  expires_in: Number,
  meta: {
    created: {
      type: Date,
      default: Date.now()
    },
    updated: {
      type: Date,
      default: Date.now()
    }
  }
})

TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

TicketSchema.statics = {
  async getTicket() {
    const ticket = await this.findOne({
      name: 'access_ticket'
    }).exec()

    if (ticket && ticket.ticket) {
      ticket.access_ticket = ticket.ticket
    }

    return ticket
  },

  async saveTicket(data) {
    let ticket = await this.findOne({
      name: 'access_ticket'
    }).exec()

    if (ticket) {
      ticket.ticket = data.access_ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'access_ticket',
        ticket: data.access_ticket,
        expires_inx: data.expires_in
      })
    }

    await ticket.save()

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
