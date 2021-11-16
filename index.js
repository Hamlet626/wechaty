// import {
//   Wechaty,
//   config
// }from 'wechaty';
//
// import { generate } from 'qrcode-terminal';
//
// require('dotenv').config();
//
// function onScan (qrcode, status) {
//   if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
//     generate(qrcode, { small: true }) ; // show qrcode on console
//
//     const qrcodeImageUrl = [
//       'https://wechaty.js.org/qrcode/',
//       encodeURIComponent(qrcode),
//     ].join('');
//
//     log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
//   } else {
//     log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
//   }
// }
//
// function onLogin (user) {
//   log.info('StarterBot', '%s login', user)
// }
//
// function onLogout (user) {
//   log.info('StarterBot', '%s logout', user)
// }
//
// async function onMessage (msg) {
//   log.info('StarterBot', msg.toString())
//
//   if (msg.text() === 'ding') {
//     await msg.say('dong')
//   }
// }
//
// const bot = new Wechaty({
//   name: 'ding-dong-bot',
// })
//
// bot.on('scan',    onScan)
// bot.on('login',   onLogin)
// bot.on('logout',  onLogout)
// bot.on('message', onMessage)
//
// bot.start()
//   .then(() => log.info('StarterBot', 'Starter Bot Started.'))
//   .catch(e => log.error('StarterBot', e))

const { Wechaty,WechatyOptions,WechatyBuilder } = require('wechaty');
// import {
//   // Wechaty,
//   // config,
//   WechatyBuilder
// } from 'wechaty';

let puppetOptions={}

if (process.env.WECHATY_PUPPET_PUPPETEER_ENDPOINT){
  puppetOptions.endpoint = process.env.WECHATY_PUPPET_PUPPETEER_ENDPOINT
}
// const wc=require("wechaty");

// import { FileBox }  from 'file-box'
const qrTerm = require('qrcode-terminal');

const express = require('express')
const PORT = process.env.PORT || 5000;

express()
  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  .get('/', (req, res) => res.send('xxx'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
/**
 *
 * 1. Declare your Bot!
 *
 */
const bot = WechatyBuilder.build({
  name: 'myWechatyBot',
  puppetOptions
})

/**
 *
 * 2. Register event handlers for Bot
 *
 */
bot
  .on('logout', onLogout)
  .on('login',  onLogin)
  .on('scan',   onScan)
  .on('error',  onError)
//   .on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
bot.start()
  .catch(async e => {
    console.error('Bot start() fail:', e)
    await bot.stop()
    process.exit(-1)
  })

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan (qrcode, status) {
  qrTerm.generate(qrcode, { small: true })

  // Generate a QR Code online via
  // http://goqr.me/api/doc/create-qr-code/
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(`[${status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}

function onLogin (user) {
  console.log(`${user.name()} login`)
  bot.say('Wechaty login').catch(console.error)
}

function onLogout (user) {
  console.log(`${user.name()} logouted`)
}

function onError (e) {
  console.error('Bot error:', e)
  /*
  if (bot.logonoff()) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (msg) {
  console.log(msg.toString())

  if (msg.age() > 60) {
    console.log('Message discarded because its TOO OLD(than 1 minute)')
    return
  }

  if (   msg.type() !== bot.Message.Type.Text
    || !/^(ding|ping|bing|code)$/i.test(msg.text())
    /*&& !msg.self()*/
  ) {
    console.log('Message discarded because it does not match ding/ping/bing/code')
    return
  }

  /**
   * 1. reply 'dong'
   */
  await msg.say('dong')
  console.log('REPLY: dong')

//   /**
//    * 2. reply image(qrcode image)
//    */
//   const fileBox = FileBox.fromUrl('https://wechaty.js.org/img/friday-qrcode.svg')
//
//   await msg.say(fileBox)
//   console.log('REPLY: %s', fileBox.toString())
//
//   /**
//    * 3. reply 'scan now!'
//    */
  await msg.say([
    'Join Wechaty Developers Community\n\n',
    'Scan now, because other Wechaty developers want to talk with you too!\n\n',
    '(secret code: wechaty)',
  ].join(''))
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/
=============== Powered by Wechaty ===============
-------- https://github.com/chatie/wechaty --------
          Version: ${bot.version(true)}
I'm a bot, my superpower is talk in Wechat.
If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________
Hope you like it, and you are very welcome to
upgrade me to more superpowers!
Please wait... I'm trying to login in...
`
console.log(welcome)

// wc.Wechaty.instance() // Singleton
//   .on('scan',     (qrcode, status)  => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
// //   .on('login',    user              => console.log(`User ${user} logined`))
// //   .on('message',  message           => console.log(`Message: ${message}`))
//   .start()
