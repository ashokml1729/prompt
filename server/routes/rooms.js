import { Router } from 'express';

const router = Router();

// In-memory rooms store
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create room (no auth required)
router.post('/', (req, res) => {
  try {
    const { mode = 'time_30', hostName = 'Host' } = req.body;
    let roomCode = generateRoomCode();

    // Ensure unique code
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const room = {
      room_code: roomCode,
      host_name: hostName,
      status: 'waiting',
      mode,
      created_at: new Date().toISOString(),
      players: [],
    };

    rooms.set(roomCode, room);

    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room by code
router.get('/:code', (req, res) => {
  try {
    const room = rooms.get(req.params.code.toUpperCase());

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List public rooms
router.get('/', (req, res) => {
  try {
    const publicRooms = [];
    for (const [code, room] of rooms) {
      if (room.status === 'waiting') {
        publicRooms.push({
          room_code: code,
          host_username: room.host_name,
          player_count: room.players.length,
          mode: room.mode,
          created_at: room.created_at,
        });
      }
    }

    // Return most recent first, max 20
    publicRooms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(publicRooms.slice(0, 20));
  } catch (err) {
    console.error('List rooms error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
