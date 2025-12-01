import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  userId: mongoose.Types.ObjectId;
  clientName: string;
  clientCompany?: string;
  projectTitle: string;
  projectDescription: string;
  budgetRange?: string;
  timelinePreference?: string;
  services: string[];
  tone: string;
  sections: {
    scopeOfWork: string;
    deliverables: string;
    timeline: string;
    pricing: string;
    terms: string;
  };
  status: 'draft' | 'sent';
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientCompany: {
      type: String,
      trim: true,
    },
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
    },
    budgetRange: {
      type: String,
      trim: true,
    },
    timelinePreference: {
      type: String,
      trim: true,
    },
    services: {
      type: [String],
      default: [],
    },
    tone: {
      type: String,
      required: [true, 'Tone is required'],
      default: 'Professional',
    },
    sections: {
      scopeOfWork: {
        type: String,
        default: '',
      },
      deliverables: {
        type: String,
        default: '',
      },
      timeline: {
        type: String,
        default: '',
      },
      pricing: {
        type: String,
        default: '',
      },
      terms: {
        type: String,
        default: '',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'sent'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProposal>('Proposal', ProposalSchema);

