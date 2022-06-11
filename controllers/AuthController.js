/* eslint-disable import/no-named-as-default */
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import { getUserFromXToken, getUserFromAuthorization } from '../utils/auth';

export default class AuthController {
  static async getConnect(req, res) {
    const user = await getUserFromAuthorization(req);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const user = await getUserFromXToken(req);
    const token = req.headers['X-Token'];

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}
