import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    activityType: {
      type: String,
      enum: ['walking', 'running', 'cycling', 'swimming', 'strength-training'],
      required: true,
    },
    durationMinutes: { type: Number, min: 1, required: true },
    distanceKm: { type: Number, min: 0 },
    calories: { type: Number, min: 0, required: true },
    startedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

activitySchema.index({ user: 1, activityType: 1, startedAt: 1 }, { unique: true });

export default model('Activity', activitySchema);
