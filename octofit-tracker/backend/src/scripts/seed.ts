import { connectDatabase, default as db } from '../config/database.js';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const userData = [
      { username: 'alex-chen', displayName: 'Alex Chen', email: 'alex.chen@example.com', bio: 'Runner and weekend hiker.' },
      { username: 'sam-rivera', displayName: 'Sam Rivera', email: 'sam.rivera@example.com', bio: 'Cyclist focused on building endurance.' },
      { username: 'jordan-lee', displayName: 'Jordan Lee', email: 'jordan.lee@example.com', bio: 'Strength training and swimming.' },
    ];
    const users = await Promise.all(
      userData.map((user) =>
        User.findOneAndUpdate(
          { username: user.username },
          { $set: user },
          { upsert: true, returnDocument: 'after' },
        ),
      ),
    );

    const team = await Team.findOneAndUpdate(
      { name: 'Trailblazers' },
      {
        $set: {
          description: 'A friendly team chasing consistent movement and outdoor adventures.',
          members: users.map((user) => user._id),
        },
      },
      { upsert: true, returnDocument: 'after' },
    );

    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    const activityData = [
      { user: users[0]!._id, activityType: 'running', durationMinutes: 32, distanceKm: 5.2, calories: 340, daysAgo: 0 },
      { user: users[1]!._id, activityType: 'cycling', durationMinutes: 48, distanceKm: 18.4, calories: 410, daysAgo: 1 },
      { user: users[2]!._id, activityType: 'swimming', durationMinutes: 35, distanceKm: 1.5, calories: 290, daysAgo: 2 },
    ] as const;
    await Promise.all(
      activityData.map(({ daysAgo, ...activity }) => {
        const startedAt = new Date(today);
        startedAt.setUTCDate(startedAt.getUTCDate() - daysAgo);
        return Activity.findOneAndUpdate(
          { user: activity.user, activityType: activity.activityType, startedAt },
          { $set: { ...activity, team: team._id, startedAt } },
          { upsert: true, returnDocument: 'after' },
        );
      }),
    );

    const period = today.toISOString().slice(0, 7);
    await Promise.all(
      users.map((user, index) =>
        Leaderboard.findOneAndUpdate(
          { user: user._id, period },
          { $set: { team: team._id, points: [420, 365, 310][index]!, period } },
          { upsert: true, returnDocument: 'after' },
        ),
      ),
    );

    const workoutData = [
      {
        title: 'Easy 5K Builder',
        description: 'A steady aerobic run with a gentle warm-up and cool-down.',
        activityType: 'running',
        durationMinutes: 35,
        difficulty: 'beginner',
      },
      {
        title: 'Full-Body Strength Circuit',
        description: 'A balanced circuit of bodyweight movements with controlled rests.',
        activityType: 'strength-training',
        durationMinutes: 40,
        difficulty: 'intermediate',
      },
      {
        title: 'Endurance Ride',
        description: 'A sustained cycling session at a conversational pace.',
        activityType: 'cycling',
        durationMinutes: 50,
        difficulty: 'intermediate',
      },
    ] as const;
    await Promise.all(
      workoutData.map((workout) =>
        Workout.findOneAndUpdate(
          { title: workout.title },
          { $set: workout },
          { upsert: true, returnDocument: 'after' },
        ),
      ),
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    if (db.readyState === 1) {
      await db.close();
    }
  }
}

seedDatabase();
