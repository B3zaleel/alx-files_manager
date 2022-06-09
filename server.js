import express from 'express';
import consign from 'consign';

const server = express();

consign()
  .include('routes')
  .then('libs/boot.js')
  .into(server);

export default server;
