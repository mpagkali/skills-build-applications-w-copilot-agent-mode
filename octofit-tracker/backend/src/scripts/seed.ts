import { connectDatabase, default as db } from '../config/database.js';
import activity from '../models/activity.js';
import leaderboard from '../models/leaderboard.js';
import team from '../models/team.js';
import user from '../models/user.js';
import workout from '../models/workout.js';

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
    const sampleUserNames = userData.map((sampleUser) => sampleUser.username);
    const existingUsers = await user.find({ username: { $in: sampleUserNames } }).select('_id');
    const existingUserIds = existingUsers.map((existingUser) => existingUser._id);

    await Promise.all([
      activity.deleteMany({ user: { $in: existingUserIds } }),
      leaderboard.deleteMany({ user: { $in: existingUserIds } }),
      team.deleteMany({ name: 'Trailblazers' }),
      user.deleteMany({ username: { $in: sampleUserNames } }),
      workout.deleteMany({
        title: { $in: ['Easy 5K Builder', 'Full-Body Strength Circuit', 'Endurance Ride'] },
      }),
    ]);

    const users = await user.insertMany(userData);
    const seededTeam = await team.create({
      name: 'Trailblazers',
      description: 'A friendly team chasing consistent movement and outdoor adventures.',
      members: users.map((sampleUser) => sampleUser._id),
    });

    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    const activityData = [
      { user: users[0]!._id, activityType: 'running', durationMinutes: 32, distanceKm: 5.2, calories: 340, daysAgo: 0 },
      { user: users[1]!._id, activityType: 'cycling', durationMinutes: 48, distanceKm: 18.4, calories: 410, daysAgo: 1 },
      { user: users[2]!._id, activityType: 'swimming', durationMinutes: 35, distanceKm: 1.5, calories: 290, daysAgo: 2 },
    ] as const;
    const activities = activityData.map(({ daysAgo, ...sampleActivity }) => {
      const startedAt = new Date(today);
      startedAt.setUTCDate(startedAt.getUTCDate() - daysAgo);
      return { ...sampleActivity, team: seededTeam._id, startedAt };
    });
    await activity.insertMany(activities);

    const period = today.toISOString().slice(0, 7);
    const leaderboardEntries = users.map((sampleUser, index) => ({
      user: sampleUser._id,
      team: seededTeam._id,
      points: [420, 365, 310][index]!,
      period,
    }));
    await leaderboard.insertMany(leaderboardEntries);

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
    await workout.insertMany(workoutData);

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
