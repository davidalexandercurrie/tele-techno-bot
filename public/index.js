let socket = io.connect();
socket.on('messageFromServer', data => onReceive(data));

const onReceive = data => {
  console.log(`Message received: ${data.msg}`);
};
document.getElementById('start-call').addEventListener('click', () => {
  socket.emit('startCall');
});
document.getElementById('play-audio').addEventListener('click', () => {
  socket.emit('playAudio');
});

for (let i = 0; i < 10; i++) {
  let button = document.createElement('BUTTON');
  button.innerText = i;
  button.addEventListener('click', () => {
    socket.emit('playAudio', { index: i });
  });
  document.getElementById('keypad').appendChild(button);
}
let textButton = document.createElement('BUTTON');
textButton.innerText = 'text';
textButton.addEventListener('click', () => {
  socket.emit('notifications', { index: 0 });
});
document.getElementById('keypad').appendChild(textButton);
let snapchat = document.createElement('BUTTON');
snapchat.innerText = 'snapchat';
snapchat.addEventListener('click', () => {
  socket.emit('notifications', { index: 1 });
});
document.getElementById('keypad').appendChild(textButton);
let gmail = document.createElement('BUTTON');
gmail.innerText = 'gmail';
gmail.addEventListener('click', () => {
  socket.emit('notifications', { index: 2 });
});
document.getElementById('keypad').appendChild(textButton);
