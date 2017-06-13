const { app, BrowserWindow, ipcMain } = require('electron')
require('../logEvents.js')
require('electron-debug')({ showDevTools: false })

const Server = require('socket.io')
const Client = require('socket.io-client')

let server_port
let socket_server

let client_port
let socket_client

let main
let chat

app.on('ready', () => {
  // Setup UI
  main = new BrowserWindow({
    title: 'P2P Chat',
    width: 250,
    height: 500,
    show: false
  })
  main.loadURL(`file://${__dirname}/index.html`)
  main.on('ready-to-show', () => {
    main.show()
  })

  ipcMain.on('start server', onStartServer)
  ipcMain.on('connect client', onConnectClient)
  ipcMain.on('send message', onSendMessage)

  // main.logEvents()
})

// app.logEvents()

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPort() {
  return getRandomInt(3000, 3999);
}

function onStartServer(event, message) {
  server_port = getRandomPort()

  socket_server = new Server()
  socket_server.on('connection', onServerConnection)
  console.log(`SERVER: listening on port ${server_port}`)
  socket_server.listen(server_port)

  event.returnValue = {
    ip: '127.0.0.1',
    port: server_port
  }
}

function onServerConnection(socket) {
  console.log('SERVER: connection')
  socket.on('chat message', onChatMessage)
}

function onChatMessage(msg) {
  console.log('received message: ', msg)
  chat.webContents.send('receive message', msg)
}

function onConnectClient(event, message) {
  client_port = message.port
  socket_client = new Client(`http://localhost:${client_port}`)

  socket_client.on('connect', function() {
    console.log('CLIENT: connect')
  })

  socket_client.on('event', function(data) {
    console.log('CLIENT: event: ', data)
  })
  socket_client.on('disconnect', function() {
    console.log('CLIENT: disconnect')
  })

  // create chat window
  chat = new BrowserWindow({
    title: 'P2P Chat',
    width: 600,
    height: 600,
    show: false
  })
  chat.loadURL(`file://${__dirname}/chat.html`)
  chat.on('ready-to-show', () => {
    main.hide()
    chat.show()
  })

  event.returnValue = true
}

function onSendMessage(event, message) {
  console.log('sending message: ', message)
  socket_client.emit('chat message', message)
}
