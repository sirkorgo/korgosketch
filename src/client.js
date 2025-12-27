import PartySocket from "partysocket";

const socket = new PartySocket({
  host: "/",
  room: "canvas",
});

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    data.strokes.forEach((stroke) => drawStroke(stroke));
  } else if (data.type === "users") {
    updateUserCount(data.count);
  } else {
    drawStroke(data);
  }
};

window.sendStroke = (stroke) => {
  socket.send(JSON.stringify(stroke));
};

function drawStroke(stroke) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();

  stroke.points.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.stroke();
}

function updateUserCount(count) {
  const counter = document.querySelector(".userCounter p:last-child");
  if (counter) counter.textContent = count;
}
