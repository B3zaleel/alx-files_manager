import sha1 from 'sha1';
import dbClient from '../utils/db';
import { getUserFromXToken } from '../utils/auth';

export default class UsersController {
  static postNew(req, res) {
    const email = `${req.body && req.body.email ? req.body.email : ''}`;
    const password = `${req.body && req.body.password ? req.body.password : ''}`;

    if (email.trim().length === 0) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (password.trim().length === 0) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    dbClient.usersCollection()
      .then(async (usersCollection) => {
        const tmpUser = await usersCollection.findOne({ email });

        if (tmpUser) {
          res.status(400).json({ error: 'Already exist' });
          return;
        }
        const user = await usersCollection.insertOne({
          email,
          password: sha1(password),
        });
        res.status(200).json({ email, id: user.insertedId.toString() });
      });
  }

  static async getMe(req, res) {
    const user = await getUserFromXToken(req);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
