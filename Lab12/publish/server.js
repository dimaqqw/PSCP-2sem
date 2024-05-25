const redis = require('redis')
const publisher  = redis.createClient();

(async () => {

    const article = {
      id: '123456',
      name: 'Using Redis Pub/Sub with Node.js',
    };
  
    await publisher.connect();
  
    await publisher.publish('article', JSON.stringify(article));
  })();