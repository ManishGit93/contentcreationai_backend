import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITemplate>('Template', TemplateSchema);

