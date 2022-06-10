/* eslint-disable import/no-named-as-default */
import { v4 } from 'uuid';
import redisClient from '../utils/redis';
import { getUserFromAuthorization } from '../utils/auth';

export default class AuthController {
  static async getConnect(req, res) {
    const user = await getUserFromAuthorization(req);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = v4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  static getDisconnect(req, res) {
    res.status(200).json({});
  }
}
