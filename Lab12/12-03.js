const redis = require('redis');
const client = redis.createClient();

client.on("connect", ()=>{
    console.log("Client connected to redis");
})

client.on("ready", ()=>{
    console.log("Client connected to redis and ready to use");
    client.set(`incr`, 0)
    // measureTime(incrOperations, '10000 запросов incr');
    // measureTime(decrOperations, '10000 запросов get');
    
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

async function incrOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.incr(`incr`);
    }
    // const finishIncrValue = await client.get(`incr`)
    // console.log("Finish incr value after 10000 incr operations " + finishIncrValue);
}

async function decrOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.decr(`incr`);
    }
    //const finishDecrValue = await client.get(`incr`)
    //console.log("Finish incr value after 10000 incr operations " + finishDecrValue);
    // await client.quit();
}

async function main(){
    await client.connect();
    await measureTime(incrOperations, '10000 запросов incr');
    await measureTime(decrOperations, '10000 запросов get');
    await client.quit();
}
main()