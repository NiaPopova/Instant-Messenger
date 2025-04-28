const messagesData = {
  general: [
    { firstName: 'Ана', lastName: 'Петрова', username: 'ana88', text: 'Здравейте всички!', timeAgo: 'преди 15 минути' },
    { firstName: 'Иван', lastName: 'Иванов', username: 'ivan_dev', text: 'Как върви проектът?', timeAgo: 'преди 40 минути' },
  ],
  dev: [
    { firstName: 'Мария', lastName: 'Николова', username: 'maria-code', text: 'Работя по новия компонент.', timeAgo: 'преди 25 минути' },
    { firstName: 'Георги', lastName: 'Тодоров', username: 'gtod', text: 'Пушнах промените в Git.', timeAgo: 'преди 50 минути' },
  ],
  random: [
    { firstName: 'Ники', lastName: 'Симеонов', username: 'nksim', text: 'Видяхте ли новия трейлър?', timeAgo: 'преди 5 минути' },
    { firstName: 'Тони', lastName: 'Колев', username: 'tonik', text: 'Имам котка, която пише код.', timeAgo: 'преди 2 минути' },
  ],
};

function getInitials(firstName, lastName) {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
}

const channelList = document.querySelector('.channel-list');
const messageContainer = document.querySelector('.chat-messages');
const channelTitle = document.querySelector('.channel-title');
const sendButton = document.querySelector('.send-button');
const messageInput = document.querySelector('.message-input');
const channelSettingsBtn = document.querySelector('.settings-btn');
const userListModal = document.querySelector('.modal');
const userList = document.querySelector('.user-list');
const closeModalButton = document.querySelector('.close-modal');
const modalChannelName = document.querySelector('.modal-channel-name');

let currentChannel = 'general';

function loadMessages(channel) {
  const messages = messagesData[channel] || [];
  messageContainer.innerHTML = '';

  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');

    msgDiv.innerHTML = `
      <div class="avatar">${getInitials(msg.firstName, msg.lastName)}</div>
      <div class="content">
        <div class="name">${msg.firstName} ${msg.lastName} <span class="username">(@${msg.username})</span></div>
        <div class="text">${msg.text}</div>
        <div class="time">🕒 ${msg.timeAgo}</div>
      </div>
    `;

    messageContainer.appendChild(msgDiv);
  });

  channelTitle.textContent = `${
    channel === 'general' ? 'Общо' : channel === 'dev' ? 'Разработка' : 'Случайни'
  }`;

  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function addMessage(text) {
  if (!text.trim()) return;

  const user = {
    firstName: 'Текущ',
    lastName: 'Потребител',
    username: 'user123',
  };

  const newMessage = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    text: text,
    timeAgo: 'преди 1 минута',
  };

  messagesData[currentChannel].push(newMessage);
  loadMessages(currentChannel);
  messageInput.value = '';
}

sendButton.addEventListener('click', () => {
  addMessage(messageInput.value);
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addMessage(messageInput.value);
  }
});

channelList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    document.querySelectorAll('.channel-list li').forEach(li => li.classList.remove('active'));
    e.target.classList.add('active');
    currentChannel = e.target.dataset.channel;
    loadMessages(currentChannel);
  }
});

channelSettingsBtn.addEventListener('click', () => {
  const users = messagesData[currentChannel] || [];

  modalChannelName.textContent = `${
    currentChannel === 'general' ? 'Общо' : currentChannel === 'dev' ? 'Разработка' : 'Случайни'
  }`;

  userList.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="avatar">${getInitials(user.firstName, user.lastName)}</div>
      <div>
        <div><strong>${user.firstName} ${user.lastName}</strong></div>
        <div style="font-size: 12px; color: gray;">@${user.username}</div>
      </div>
    `;
    userList.appendChild(li);
  });

  userListModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  userListModal.classList.add('hidden');
});

loadMessages('general');
