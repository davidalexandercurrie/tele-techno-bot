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
