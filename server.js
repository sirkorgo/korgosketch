import { PartyServer } from "partyserver";

class CanvasServer {
  constructor(room) {
    this.room = room;
  }

  async onConnect(connection) {
    const strokes = (await this.room.storage.get("strokes")) || [];
    connection.send(JSON.stringify({ type: "init", strokes }));
    this.broadcast({
      type: "users",
      count: [...this.room.getConnections()].length,
    });
  }

  async onMessage(message, sender) {
    const stroke = JSON.parse(message);
    const strokes = (await this.room.storage.get("strokes")) || [];
    strokes.push(stroke);
    await this.room.storage.put("strokes", strokes);
    this.room.broadcast(message, [sender.id]);
  }

  async onClose(connection) {
    const connections = [...this.room.getConnections()];
    if (connections.length === 0) await this.room.storage.put("strokes", []);
    this.broadcast({ type: "users", count: connections.length });
  }

  broadcast(data) {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    this.room.broadcast(message);
  }
}

// Initialize PartyServer
const server = new PartyServer({
  async onConnect(connection, room) {
    const cs = new CanvasServer(room);
    return cs.onConnect(connection);
  },
  async onMessage(message, connection, room) {
    const cs = new CanvasServer(room);
    return cs.onMessage(message, connection);
  },
  async onClose(connection, room) {
    const cs = new CanvasServer(room);
    return cs.onClose(connection);
  },
});

export default {
  async fetch(req) {
    return server.fetch(req, {
      headers: {
        // Allow iframe embedding from your main site
        "Content-Security-Policy": "frame-ancestors https://sirkorgo.com",
        // Allow fetches from your main site if needed
        "Access-Control-Allow-Origin": "https://sirkorgo.com",
      },
    });
  },
};
