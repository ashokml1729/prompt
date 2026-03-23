export function setupSocketHandlers(io) {
  const rooms = new Map(); // roomCode -> { players, text, status }

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', ({ roomCode, username }) => {
      try {
        const code = roomCode.toUpperCase();
        socket.join(code);
        socket.roomCode = code;
        socket.username = username || 'Guest';

        // Auto-create room if it doesn't exist
        if (!rooms.has(code)) {
          rooms.set(code, {
            players: new Map(),
            text: null,
            status: 'waiting',
          });
        }

        const roomData = rooms.get(code);
        roomData.players.set(socket.id, {
          id: socket.id,
          username: socket.username,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          finished: false,
        });

        // Broadcast updated player list
        io.to(code).emit('room-update', {
          players: Array.from(roomData.players.values()),
          status: roomData.status,
          text: roomData.text,
        });
      } catch (err) {
        console.error('Join room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('create-room', ({ roomCode, username }) => {
      try {
        const code = roomCode.toUpperCase();
        socket.join(code);
        socket.roomCode = code;
        socket.username = username || 'Host';

        rooms.set(code, {
          players: new Map(),
          text: null,
          status: 'waiting',
        });

        const roomData = rooms.get(code);
        roomData.players.set(socket.id, {
          id: socket.id,
          username: socket.username,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          finished: false,
        });

        io.to(code).emit('room-update', {
          players: Array.from(roomData.players.values()),
          status: roomData.status,
          text: roomData.text,
        });
      } catch (err) {
        console.error('Create room error:', err);
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    socket.on('start-race', ({ roomCode, text }) => {
      const roomData = rooms.get(roomCode);
      if (!roomData) return;

      roomData.status = 'countdown';
      roomData.text = text;

      // Reset all players for a new race
      for (const player of roomData.players.values()) {
        player.progress = 0;
        player.wpm = 0;
        player.accuracy = 100;
        player.finished = false;
        player.position = 0;
      }

      io.to(roomCode).emit('race-countdown', { text });

      // 3-2-1 countdown
      let count = 3;
      const countdownInterval = setInterval(() => {
        io.to(roomCode).emit('countdown-tick', { count });
        count--;
        if (count < 0) {
          clearInterval(countdownInterval);
          roomData.status = 'racing';
          io.to(roomCode).emit('race-start', { text });
        }
      }, 1000);
    });

    socket.on('player-progress', ({ roomCode, progress, wpm, accuracy }) => {
      const roomData = rooms.get(roomCode);
      if (!roomData) return;

      const player = roomData.players.get(socket.id);
      if (player) {
        player.progress = progress;
        player.wpm = wpm;
        player.accuracy = accuracy;

        io.to(roomCode).emit('progress-update', {
          players: Array.from(roomData.players.values()),
        });
      }
    });

    socket.on('player-finished', ({ roomCode, wpm, accuracy }) => {
      const roomData = rooms.get(roomCode);
      if (!roomData) return;

      const player = roomData.players.get(socket.id);
      if (player) {
        player.finished = true;
        player.progress = 100;
        player.wpm = wpm;
        player.accuracy = accuracy;

        // Calculate position
        const finishedCount = Array.from(roomData.players.values()).filter(
          (p) => p.finished
        ).length;
        player.position = finishedCount;

        io.to(roomCode).emit('progress-update', {
          players: Array.from(roomData.players.values()),
        });

        // Check if all finished
        const allFinished = Array.from(roomData.players.values()).every(
          (p) => p.finished
        );
        if (allFinished) {
          roomData.status = 'finished';
          io.to(roomCode).emit('race-finished', {
            players: Array.from(roomData.players.values()),
          });
        }
      }
    });

    socket.on('disconnect', () => {
      if (socket.roomCode) {
        const roomData = rooms.get(socket.roomCode);
        if (roomData) {
          roomData.players.delete(socket.id);

          if (roomData.players.size === 0) {
            rooms.delete(socket.roomCode);
          } else {
            io.to(socket.roomCode).emit('room-update', {
              players: Array.from(roomData.players.values()),
              status: roomData.status,
              text: roomData.text,
            });
          }
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
