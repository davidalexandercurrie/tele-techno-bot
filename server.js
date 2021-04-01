const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Vonage = require('@vonage/server-sdk');
require('dotenv').config();
const options = {
  /* ... */
};
const io = require('socket.io')(http, options);
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: 'fe19e5ee-3fb1-4b34-ba98-082874cca10d',
  privateKey: Buffer.from(
    process.env.VONAGE_APPLICATION_PRIVATE_KEY64,
    'base64'
  ),
});

let dtmfSounds = [
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-0.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-1.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-2.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-3.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-4.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-5.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-6.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-7.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-8.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-9.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-hash.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/dtmf-star.mp3',
];

let callInProgress = false;

let UUID = '';

const DIGITS = '1p2p3p4p5p6p7p8p9p0';

const makeCall = socket => {
  if (!callInProgress) {
    vonage.calls.create(
      {
        to: [
          {
            type: 'phone',
            number: '13472233468',
          },
        ],
        from: {
          type: 'phone',
          number: '13472233468',
        },
        ncco: [
          {
            action: 'conversation',
            name: 'nexmo-conference-standard',
            record: 'false',
          },
        ],
      },
      (error, response) => {
        if (error) console.error(error);
        if (response) {
          // startDTMF(response, socket);
          UUID = response.uuid;
        }
      }
    );
  }
};

const startDTMF = (response, socket) => {
  if (response.status == 'answered') {
    socket.emit('messageFromServer', { msg: 'call started...' });

    vonage.calls.dtmf.send(response.uuid, { digits: DIGITS }, (err, res) => {
      if (err) {
        console.error(err);
        console.log('hi');
      } else {
        console.log(res);
      }
    });
  } else {
    setTimeout(() => {
      vonage.calls.get(response.uuid, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.log(res);
          startDTMF(res, socket);
        }
      });
    }, 1000);
  }
};

io.on('connection', socket => {
  console.log('User connected! Their ID is ' + socket.id);

  socket.on('startCall', () => {
    console.log('hi');
    if (!callInProgress) {
      makeCall(socket);
      callInProgress = true;
      socket.emit('messageFromServer', { msg: 'calling...' });
    } else {
      socket.emit('messageFromServer', { msg: 'busy...' });
    }
  });
  socket.on('playAudio', () => {
    vonage.calls.stream.start(
      UUID,
      {
        stream_url: [dtmfSounds[Math.floor(Math.random() * dtmfSounds.length)]],
        loop: 0,
      },
      (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.log(res);
        }
      }
    );
  });
});

app.use(express.static('public'));
const listener = http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});
