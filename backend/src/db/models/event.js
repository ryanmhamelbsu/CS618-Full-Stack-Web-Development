import mongoose, { Schema } from 'mongoose'

const eventsSchema = new Schema(
  {
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'recipe',
      required: true,
    },
    session: { type: String, required: true },
    action: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
)

export const Event = mongoose.model('events', eventsSchema)