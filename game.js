const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');

let snake;
class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.body = [{x, y}];
    this.d = 1;
  }
  move() {
    u = Date.now();
    this.sim(this);
    if (this.x < 0 || this.y < 0 || this.x > 30*LIM || this.y > 30*LIM || this.body.some(s => s.x === this.x && s.y === this.y)) return lose();
    this.body.unshift({x: this.x, y: this.y});
    if (!apples.some((a, i) => a.x === this.x && a.y === this.y && (apples.splice(i, 1) || 1))) this.body.pop(); else {
      if (this.body.length === 100) return victory(); else apples.push(new Apple(...coord()));
    }
  }
  sim = o => o[Math.abs(this.d) == 2 ? 'x' : 'y'] += this.d < 0 ? -30 : 30;
  draw() {
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < this.body.length; i++) ctx.fillRect(this.body[i].x, this.body[i].y, 30, 30);
  }
}

class Apple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x, this.y, 30, 30);
  }
}

const coord = _ => {
  let x, y;
  do {
    x = random();
    y = random();
  } while (snake != null && snake.body.some(c => c.x === x && c.y === y));
  return [x, y];
}
const LIM = 9, random = _ => 30*Math.floor(Math.random()*9);

const frame = _ => {
  ctx.clearRect(0, 0, 300, 300);
  for (const a of apples) a.draw();
  snake.draw();
  if (!active) {
    ctx.globalAlpha = .2;
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, 300, 300);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(msg, 150, 150);
  }
}

const cleanup = _ => {
  active = false;
  apples.length = 0;
  clearInterval(i);
}
const lose = _ => {
  cleanup();
  msg = 'You lose!';
}
const victory = _ => {
  cleanup();  
  msg = 'You win!';
}

let active = false, msg = 'Click to Start!', i, u;
const SNAKE_SPEED = 200, apples = [];
snake = new Snake(...coord());
apples.push(new Apple(...coord()));
const start = _ => {
  active = true;
  i = setInterval(_ => snake.move(), SNAKE_SPEED);
  if (msg.slice(0, 1) !== 'Y') return;
  snake = new Snake(...coord());
  apples.push(new Apple(...coord()));
}
document.addEventListener('keydown', e => {
  if (e.keyCode == 87 ) {
    if (snake.d != 1) snake.d = -1;
  } else if (e.keyCode === 83) {
    if (snake.d != -1) snake.d = 1;
  } else if (e.keyCode === 65) {
    if (snake.d != 2) snake.d = -2;
  } else if (e.keyCode === 68) if (snake.d != -2) snake.d = 2; 
});
document.addEventListener('click', _ => !active && start());
requestAnimationFrame(l = _ => frame() || requestAnimationFrame(l));