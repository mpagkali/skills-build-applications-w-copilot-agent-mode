import { Router } from 'express';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

const apiRouter = Router();

apiRouter.get('/users/', async (_request, response) => {
  response.json(await User.find().sort({ username: 1 }).lean());
});

apiRouter.get('/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'username displayName').sort({ name: 1 }).lean());
});

apiRouter.get('/activities/', async (_request, response) => {
  response.json(
    await Activity.find()
      .populate('user', 'username displayName')
      .populate('team', 'name')
      .sort({ startedAt: -1 })
      .lean(),
  );
});

apiRouter.get('/leaderboard/', async (_request, response) => {
  response.json(
    await Leaderboard.find()
      .populate('user', 'username displayName')
      .populate('team', 'name')
      .sort({ points: -1 })
      .lean(),
  );
});

apiRouter.get('/workouts/', async (_request, response) => {
  response.json(await Workout.find().sort({ title: 1 }).lean());
});

export default apiRouter;
