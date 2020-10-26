const mongoose = require('mongoose')

const gameStatusSchema = new mongoose.Schema({
    content: {type: String,},
    favourite: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

gameStatusSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', gameStatusSchema)