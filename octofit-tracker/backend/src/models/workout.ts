import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    activityType: {
      type: String,
      enum: ['walking', 'running', 'cycling', 'swimming', 'strength-training'],
      required: true,
    },
    durationMinutes: { type: Number, min: 1, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);
