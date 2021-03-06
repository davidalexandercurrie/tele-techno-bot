const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Vonage = require('@vonage/server-sdk');
require('dotenv').config();
let b = 0;
const imessage = require('osa-imessage');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'davidalexandercurrie@gmail.com',
    pass: 'hyhqoqnwqolrllvf',
  },
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'll4132@nyu.edu',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
};
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

const numbers = ['+13472958111'];

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

let notificationSounds = [
  'https://tele-techno-bot.herokuapp.com/Audio/apple-text.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/snapchat.mp3',
  'https://tele-techno-bot.herokuapp.com/Audio/gmail.mp3',
];

// let dtmfSounds = [
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-001.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-002.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-003.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-004.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-005.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-006.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-007.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-008.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-009.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-010.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-011.mp3',
//   'https://tele-techno-bot.herokuapp.com/Audio/dtmf-louder-012.mp3',
// ];

let callInProgress = false;

let UUID = '';

const DIGITS =
  '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';

const makeCall = socket => {
  if (!callInProgress) {
    vonage.calls.create(
      {
        to: [
          {
            type: 'phone',
            // number: '13472233468',
            number: '13472958111',
          },
        ],
        from: {
          type: 'phone',
          number: '13472958111',
          // number: '13472233468',
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
  socket.on('notifications', data => {
    if (data.index == 2) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    if (data.index == 0) {
      imessage.send(numbers[0], 'hello');
    }
    vonage.calls.stream.start(
      UUID,
      {
        stream_url: [notificationSounds[data.index]],
        loop: 1,
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
  socket.on('playAudio', data => {
    vonage.calls.stream.start(
      UUID,
      {
        stream_url: [dtmfSounds[data.index]],
        loop: 1,
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
