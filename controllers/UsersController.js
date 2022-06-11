/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';
import { APIError } from '../middlewares/error';

const userQueue = new Queue('email sending');

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email) {
      throw new APIError(400, 'Missing email');
    }
    if (!password) {
      throw new APIError(400, 'Missing password');
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) {
      throw new APIError(400, 'Already exist');
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add(`Welcome mail [${userId}]`, { userId });
    res.status(201).json({ email, id: userId });
  }

  static async getMe(req, res) {
    const { user } = req;

    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
