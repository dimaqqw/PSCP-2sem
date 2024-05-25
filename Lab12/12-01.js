const redis = require('redis')
const client = redis.createClient();

client.on("connect", ()=>{
    console.log("Client connected to redis");
})

client.on("ready", ()=>{
    console.log("Client connected to redis and ready to use");
})

client.on("error", (err)=>{
    console.error(err.message);
})

client.on("end", ()=>{
    console.log("Client disconnected from redis");
})

async function main(){
    await client.connect();
    await client.quit();
}

main()