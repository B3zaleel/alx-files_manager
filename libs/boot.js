module.exports = (api) => {
  let port;
  const env = process.env.ENV || 'dev';

  if (process.env.ENV === 'test') {
    port = process.env.PORT_TEST || 5005;
  } else {
    port = process.env.PORT || 5000;
  }
  api.listen(port, () => {
    console.log(`[${env}] API has started listening at port:${port}`);
  });
};
