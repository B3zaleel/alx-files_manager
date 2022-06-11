/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';

describe('dbClient utility', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
    setTimeout(done, 5000);
  });

  it('client is alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('nbUsers are 0', async () => {
    expect(await dbClient.nbUsers()).to.equal(0);
  });

  it('nbFiles are 0', async () => {
    expect(await dbClient.nbFiles()).to.equal(0);
  });
});
