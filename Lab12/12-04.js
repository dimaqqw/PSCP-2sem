const redis = require('redis');
const client = redis.createClient();

client.on("connect", ()=>{
    console.log("Client connected to redis");
})

client.on("ready", ()=>{
    console.log("Client connected to redis and ready to use");
    // measureTime(hSetOperations, '10000 запросов hset');
    // measureTime(hGetOperations, '10000 запросов get');
})

client.on('error', err => {
    console.error('Redis client error:', err);
});

client.on("end", ()=>{
    console.log("Client disconnected from redis");
})

const numberOfRequests = 10000;

// Функция для измерения времени выполнения операций
async function measureTime(callback, operationName) {
    const startTime = process.hrtime();
    await callback();
    const endTime = process.hrtime(startTime);
    const duration = (endTime[0] * 1e9 + endTime[1]) / 1e6; // Время в миллисекундах
    console.log(`Время выполнения ${operationName}: ${duration} мс`);
}

async function hSetOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.hSet('myKey', `${n}`, JSON.stringify({
            id : n,
            val: `val-${n}`
        }))
    }
}

async function hGetOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.hGet('myKey', `${n}`);
    }
    //console.log(await client.hGet('myKey', '124'));
}

async function main(){
    await client.connect();
    await measureTime(hSetOperations, '10000 запросов hSet');
    await measureTime(hGetOperations, '10000 запросов hGet');
    await client.quit();
}
main()