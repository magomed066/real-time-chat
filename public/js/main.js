const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const roomUsers = document.getElementById('users')

// Get userName and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

const socket = io()

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room)
	outputUsers(users)

	console.log(users)
})

socket.on('message', (data) => {
	outputMessage(data)

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const msg = e.target.elements.msg.value

	// Emit msg to server
	socket.emit('chatMessage', msg)

	// Clear input
	e.target.elements.msg.value = ''
	e.target.elements.msg.focus()
})

function outputMessage({ text, time, username }) {
	const div = document.createElement('div')
	div.classList.add('message')

	div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">${text}</p>
  `

	document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
	roomName.textContent = room
}

function outputUsers(users) {
	const li = users.map((u) => `<li>${u.username}</li>`).join('')

	roomUsers.innerHTML = ''
	roomUsers.insertAdjacentHTML('beforeend', li)
}
