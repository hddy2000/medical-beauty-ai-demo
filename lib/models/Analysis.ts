import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  aiResult: {
    summary: String,
    symmetry: {
      score: Number,
      status: String,
      description: String,
    },
    redness: {
      detected: Boolean,
      areas: [String],
      severity: String,
    },
    swelling: {
      detected: Boolean,
      confidence: Number,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    confidence: Number,
    needReview: Boolean,
  },
  doctorReview: {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
    comment: {
      type: String,
      default: '',
    },
    reviewedAt: Date,
  },
  status: {
    type: String,
    enum: ['analyzing', 'completed', 'failed'],
    default: 'analyzing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
