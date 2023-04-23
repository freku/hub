import { Schema } from 'mongoose'
import { SCRIPT_STATUS } from '../consts/SCRIPT_STATUS.js'

export const scriptSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => {
          return value === SCRIPT_STATUS.IDLE || value === SCRIPT_STATUS.RUNNING
        },
      },
    },
    runBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pid: {
      type: Number,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
