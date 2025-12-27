const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default class CanvasServer {
  static async onBeforeRequest(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: HEADERS });
    }
    return req;
  }

  constructor(room) {
    this.room = room;
  }

  async onRequest(req) {
    return new Response(null, {
      headers: {
        ...HEADERS,
        "Content-Security-Policy": "frame-ancestors *",
      },
    });
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
    if (connections.length === 0) {
      await this.room.storage.put("strokes", []);
    }
    this.broadcast({ type: "users", count: connections.length });
  }

  broadcast(data) {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    this.room.broadcast(message);
  }
}
