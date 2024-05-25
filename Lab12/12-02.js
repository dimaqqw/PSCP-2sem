const redis = require('redis');
const client = redis.createClient();

client.on("connect", ()=>{
    console.log("Client connected to redis");
})

client.on("ready", async ()=>{
    console.log("Client connected to redis and ready to use");
    // measureTime(setOperations, '10000 запросов set');
    // measureTime(getOperations, '10000 запросов get');
    // measureTime(delOperations, '10000 запросов del');
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

async function setOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.set(`${n}`, `set${n}`);
    }
}

async function getOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.get(`${n}`)
    }
}

async function delOperations() {
    for (let n = 0; n < numberOfRequests; n++) {
        await client.del(`${n}`);
    }

}


async function main(){
    await client.connect();
    await measureTime(setOperations, '10000 запросов set');
    await measureTime(getOperations, '10000 запросов get');
    await measureTime(delOperations, '10000 запросов del');
    await client.quit();
}
main()