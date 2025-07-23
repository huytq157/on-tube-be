import mongoose, { Schema } from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const CategoryModel = mongoose.model('Category', CategorySchema)
