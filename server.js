import express from 'express';
import consign from 'consign';

const server = express();

consign()
  .include('libs/middlewares.js')
  .then('routes')
  .then('libs/boot.js')
  .into(server);

export default server;
