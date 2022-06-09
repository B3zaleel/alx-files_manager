import AppController from '../controllers/AppController';

module.exports = (api) => {
  api.get('/status', AppController.getStatus);
  api.get('/stats', AppController.getStats);
};
