const tgbot = require('node-telegram-bot-api')
const cron = require('node-cron')
const axios = require('axios')

const token = '7083629836:AAHObstlLHbkXEVf75qIRaNg5BVQ3RGzMCI'
const weatherApiToken = '58db7c05dd7549ac88d201202241905'

const bot = new tgbot(token, { polling: true })
let subscribers = []

async function sendRandomFact(chatId) {
  try {
    const response = await axios.get(
      'https://useless-facts.sameerkumar.website/api'
    )
    const fact = response.data.data
    bot.sendMessage(chatId, fact)
  } catch (error) {
    console.error('Error fetching fact:', error)
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(
    chatId,
    'Приветствую вас в ТЕЛЕГРАМ БОТЕ DIMAAQQW. Команды которые я знаю:\n/subscribe\n/unscribe\n/weather city\n/joke\n/cat\nИ умею отправлять стикеры на сообщения: хорошо, привет, плохо, отлично'
  )
})

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId)
    bot.sendMessage(chatId, 'Вы подписались на рассылку случайного факта.')

    if (subscribers.length === 1) {
      cron.schedule('*/3 * * * * *', () => {
        subscribers.forEach((chatId) => {
          sendRandomFact(chatId)
        })
      })
    }
  } else {
    bot.sendMessage(chatId, 'Вы уже подписаны на рассылку.')
  }

  console.log('Список подписчиков:', subscribers)
})

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id
  if (subscribers.includes(chatId)) {
    subscribers = subscribers.filter((id) => id !== chatId)
    bot.sendMessage(chatId, 'Вы отписались от рассылки.')
  } else {
    bot.sendMessage(chatId, 'Вы не подписаны на рассылку.')
  }

  console.log('Список подписчиков:', subscribers)
})

bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const city = match[1]

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${weatherApiToken}&q=${city}&aqi=no`
    const response = await axios.get(url)
    const { location, current } = response.data

    const weatherInfo = `
            Город: ${location.name}, ${location.country}
            Температура: ${current.temp_c}°C
            Влажность: ${current.humidity}%
            Давление: ${current.pressure_mb}hPa
            Ветер: ${current.wind_kph}km/h ${current.wind_dir}
            Условия: ${current.condition.text}
            Время обновления: ${current.last_updated}
        `

    bot.sendMessage(chatId, weatherInfo)
  } catch (error) {
    console.error('Error fetching weather:', error)
    bot.sendMessage(chatId, 'Не удалось получить информацию о погоде.')
  }
})

bot.onText(/\/joke/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const response = await axios.get('http://www.anekdot.ru/random/anekdot/')

    const joke = response.data.match(/<div class="text">([\s\S]*?)<\/div>/)

    if (joke && joke[1]) {
      const formattedJoke = joke[1].trim().replace(/<br>/g, '\n')
      bot.sendMessage(chatId, formattedJoke)
    } else {
      throw new Error('Не удалось получить шутку.')
    }
  } catch (error) {
    console.error('Error fetching joke:', error)
    bot.sendMessage(chatId, 'Не удалось получить шутку.')
  }
})

bot.onText(/\/cat/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const response = await axios.get(
      'https://api.thecatapi.com/v1/images/search'
    )
    const imageUrl = response.data[0].url
    bot.sendPhoto(chatId, imageUrl)
  } catch (error) {
    console.error('Error fetching cat image:', error)
    bot.sendMessage(chatId, 'Не удалось найти изображение кота.')
  }
})

const stickerResponses = {
  привет:
    'CAACAgQAAxkBAAEFjDpmSvOrPUdj-uMzVjTGqX2WCfGuNAACaxMAAj1MqFIUP_bSR3aQQTUE',
  плохо:
    'CAACAgUAAxkBAAEFjDhmSvOW0vlvfEBHBNYg9oR2aKCt1QACOgkAAjdQYVfzJAlgoX5lNDUE',
  хорошо:
    'CAACAgQAAxkBAAEFjDxmSvO40SHH6STiAAFHy80EEyO0PNsAAu8RAAKRGbhQKEfdA7IROkU1BA',
  отлично:
    'CAACAgUAAxkBAAEFjD5mSvPT4pNiYsrq6Ok2NjdGihHuawACdQgAAokUuVaYwrUypR22IDUE',
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id
  const messageText = msg.text.toLowerCase()

  for (const [phrase, sticker] of Object.entries(stickerResponses)) {
    if (messageText.includes(phrase)) {
      bot.sendSticker(chatId, sticker)
      return
    }
  }
})

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, 'эхо: ' + msg.text)
})

console.log('Telegram Bot работает')
