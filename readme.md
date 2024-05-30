## Socket.io Events for Public/Private Room Communication

This document describes the socket.io events used for communication within rooms in your application. These events enable users to join rooms, send messages (emojis, sounds, AI voices), and leave rooms.

### Events

#### Connection (`EVENTS.SOCKET.CONNECTION`)

- **Emitted by:** Server
- **Params:** None
- **Description:** This event is emitted by the server when a new client connects.

#### Join Channel (`EVENTS.CHANNEL.JOIN`)

- **Emitted by:** Client
- **Params:**
    - `channel_frequency`: The name of the room (channel) to join.
- **Description:** This event allows a client to join a specific room.

#### Send Emoji (`EVENTS.CHANNEL.SEND_EMOJI`)

- **Emitted by:** Client
- **Params:**
    - `channel_frequency`: The name of the room to send the emoji to.
    - `content`: The emoji content to be sent.
- **Description:** This event allows a client to send an emoji to a specific room. The emoji content is then broadcasted to all members of that room.

#### Send Sound (`EVENTS.CHANNEL.SEND_SOUND`)

- **Emitted by:** Client
- **Params:**
    - `channel_frequency`: The name of the room to send the sound to.
    - `content`: The sound content to be sent.
- **Description:** Similar to `EVENTS.CHANNEL.SEND_EMOJI`, this event allows a client to send a sound message to a specific room.

#### Send AI Voice (`EVENTS.CHANNEL.SEND_AI_VOICE`)

- **Emitted by:** Client
- **Params:**
    - `channel_frequency`: The name of the room to send the AI voice to.
    - `content`: The AI voice content to be sent.
- **Description:** This event allows a client to send an AI voice message to a specific room.

#### Leave Channel (`EVENTS.CHANNEL.LEAVE_CHANNEL`)

- **Emitted by:** Client
- **Params:**
    - `channel_frequency`: The name of the room to leave.
- **Description:** This event allows a client to leave a specific room.

#### Disconnect (`EVENTS.SOCKET.DISCONNECT`)

- **Emitted by:** Client
- **Params:**
    - `user_id`: The user ID associated with the disconnected socket (optional, depending on `helper.logoutUser` implementation).
- **Description:** This event is emitted by the client when the socket disconnects.  

### Additional Notes

- The server broadcasts messages sent within a room to all members of that room using `io.to(channel_frequency).emit(...)`.
- The `helper.logoutUser` function (implementation not shown) is assumed to handle user logout logic based on the provided parameters (user ID and socket ID).
