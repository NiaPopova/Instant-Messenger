const socket = io("http://localhost:4002");

let currentUser = '';
let selectedUser = '';
let users = [];

window.login = async function () {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter username and password!');
    return;
  }

  try {
    const fetchedUser = await fetch('http://localhost:4002/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await fetchedUser.json();

    if (!fetchedUser.ok || !data.user) {
      alert(data.message || 'Login failed');
      return;
    }

    currentUser = data.user.username;
    socket.emit('log', currentUser);

    document.getElementsByClassName('login-form')[0].style.display = 'none';
    document.getElementsByClassName('chat-page')[0].style.display = 'flex';

    loadUsers();
  } catch (error) {
    alert('Error during login!');
    console.error(error);
  }
};

async function loadUsers() {
  const fetchedUsers = await fetch('http://localhost:4002/users');
  users = await fetchedUsers.json();

  const userList = document.getElementsByClassName('user-list')[0];
  userList.innerHTML = '';

  users.forEach(({ username }) => {
    if (username !== currentUser) {
      const userInList = document.createElement('div');
      userInList.textContent = username;

      userInList.onclick = () => {
        selectedUser = username;
        
        const selectedUserTitleInChat = document.getElementsByClassName('selected-user')[0];
        selectedUserTitleInChat.textContent = selectedUser;

        loadMessages();
      };

      userList.appendChild(userInList);
    }
  });
  
  const currentUserValue = document.getElementsByClassName('current-user')[0];
  currentUserValue.textContent = currentUser;
}

function loadMessages() {
  fetch(`http://localhost:4002/messages/${currentUser}/${selectedUser}`)
    .then(resultMessage => resultMessage.json())
    .then(messages => {
      const messagesDiv = document.getElementsByClassName('message-wrapper')[0];
      messagesDiv.innerHTML = '';
      messages.forEach(message => {
        appendMessage(message);
      });
    });
}

window.sendMessage = function () {  
  const inputField = document.getElementsByClassName('message-input')[0];
  const content = inputField.value.trim();

  if (!content || !selectedUser) {
    return;
  }

  socket.emit('message', {
    sender: currentUser,
    receiver: selectedUser,
    content
  });

  loadMessages();

  inputField.value = '';
};

socket.on('message', ({ sender, content }) => {
  if (sender === selectedUser) {
    appendMessage( { sender, content });
  } 
});

socket.on('sent_message', ({ receiver, content, timestamp }) => { 
  if (receiver === currentUser) { 
    appendMessage({ sender: currentUser, content });
  } 
});

function appendMessage( { sender, content}) { 
  const messagesWrapper = document.getElementsByClassName('message-wrapper')[0];

  const message = document.createElement('div');
  message.classList.add('message');

  const divSender = document.createElement('div'); 
  divSender.classList.add('sender');
  divSender.textContent = sender === currentUser ? 'You' : sender; 

  const divContent = document.createElement('div'); 
  divContent.classList.add('content');
  divContent.textContent = content; 

  if(sender === currentUser) {
    message.setAttribute('id', 'current');
  }

  message.appendChild(divSender); 
  message.appendChild(divContent); 

  messagesWrapper.appendChild(message);
}
