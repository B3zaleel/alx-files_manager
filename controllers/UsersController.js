/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';
import { APIError } from '../middlewares/error';

const userQueue = new Queue('email sending');

export default class UsersController {
  static postNew(req, res) {
    const email = `${req.body && req.body.email ? req.body.email : ''}`;
    const password = `${req.body && req.body.password ? req.body.password : ''}`;

    if (email.trim().length === 0) {
      throw new APIError(400, 'Missing email');
    }
    if (password.trim().length === 0) {
      throw new APIError(400, 'Missing password');
    }
    dbClient.usersCollection()
      .then(async (usersCollection) => {
        const tmpUser = await usersCollection.findOne({ email });

        if (tmpUser) {
          res.status(400).json({ error: 'Already exist' });
          return;
        }
        const insertionInfo = await usersCollection.insertOne({
          email,
          password: sha1(password),
        });
        const userId = insertionInfo.insertedId.toString();
        userQueue.add(`Welcome mail [${userId}]`, { userId });
        res.status(201).json({ email, id: userId });
      });
  }

  static async getMe(req, res) {
    const { user } = req;

    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
