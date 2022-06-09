import express from 'express';
import consign from 'consign';

const server = express();

consign()
  .include('routes')
  .then('libs/middlewares.js')
  .then('libs/boot.js')
  .into(server);

export default server;
