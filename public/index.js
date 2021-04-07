let socket = io.connect();
socket.on('messageFromServer', data => onReceive(data));

document.getElementById('start-call').addEventListener('click', () => {
  socket.emit('startCall');
});

for (let i = 1; i < 11; i++) {
  if (i == 10) {
    let button = document.createElement('BUTTON');
    button.innerText = '#';
    button.addEventListener('click', () => {
      socket.emit('playAudio', { index: 10 });
    });
    document.getElementById('keypad').appendChild(button);
  }
  let button = document.createElement('BUTTON');
  button.innerText = i % 10;
  button.addEventListener('click', () => {
    socket.emit('playAudio', { index: i % 12 });
  });
  document.getElementById('keypad').appendChild(button);

  if (i == 10) {
    let button = document.createElement('BUTTON');
    button.innerText = '*';
    button.addEventListener('click', () => {
      socket.emit('playAudio', { index: 11 });
    });
    document.getElementById('keypad').appendChild(button);
  }
}
let textButton = document.createElement('BUTTON');
textButton.innerText = 'text';
textButton.addEventListener('click', () => {
  socket.emit('notifications', { index: 0 });
});
document.getElementById('messages').appendChild(textButton);
let snapchat = document.createElement('BUTTON');
snapchat.innerText = 'snapchat';
snapchat.addEventListener('click', () => {
  socket.emit('notifications', { index: 1 });
});
document.getElementById('messages').appendChild(snapchat);
let gmail = document.createElement('BUTTON');
gmail.innerText = 'gmail';
gmail.addEventListener('click', () => {
  socket.emit('notifications', { index: 2 });
});
document.getElementById('messages').appendChild(gmail);

const onReceive = data => {
  // document.getElementById('status').innerText = data.msg;
};
