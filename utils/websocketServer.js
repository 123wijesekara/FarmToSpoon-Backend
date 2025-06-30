import { WebSocketServer as WSServer } from 'ws';

class WebSocketServer {
  constructor(server) {
    this.wss = new WSServer({ server });
    this.clients = new Map();
    this.setupConnectionHandling();
    console.log(' WebSocket Server initialized');
  }

  setupConnectionHandling() {
    this.wss.on('connection', (ws, req) => {
      const params = new URLSearchParams(req.url.split('?')[1]);
      const userId = params.get('userId');

      if (!userId) {
        ws.close(1008, 'Unauthorized');
        return;
      }

      this.clients.set(userId, ws);
      console.log(` Client connected: ${userId}`);

      ws.isAlive = true;
      ws.on('pong', () => ws.isAlive = true);

      ws.on('close', () => {
        this.clients.delete(userId);
        console.log(` Client disconnected: ${userId}`);
      });

      ws.on('error', (err) => {
        console.error(` WebSocket error [${userId}]:`, err);
      });
    });

    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  sendToUser(userId, message) {
    const client = this.clients.get(userId);
    if (client && client.readyState === 1) {
      client.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  broadcast(message, excludeUserId = null) {
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === 1 &&
        (!excludeUserId || client.userId !== excludeUserId)
      ) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

export default WebSocketServer;
