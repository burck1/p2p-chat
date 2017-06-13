# Peer to Peer Chat App

I built this app in order to learn the electron framework: https://electron.atom.io/

## Design

The app has two windows, one for initiating a chat session and another for your chat message thread.

## Implementation

I decided to use socketio for the app to app communication for its real-time nature as well as its simple event-based programming model within nodejs. On startup, the app opens a socket on a random port and displays it to the user. The user can then enter the port of the user they wish to connect to. The connection form submit then uses ipc to send the port to the main process. Then, the main process initiates the socketio connection and opens a chat window. All chat messages are then passed from the chat window to the main process and then forwarded through the socketio connection. The main process of the remote client will then receive the message and use ipc to pass it through to the chat window.
