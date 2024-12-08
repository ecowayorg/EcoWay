let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.createElement("canvas");
document.querySelector("#canvas").appendChild(dom_canvas);
let CTX = dom_canvas.getContext("2d");

const W = (dom_canvas.width = 500);
const H = (dom_canvas.height = 500);

let snake,
  food,
  currentHue,
  cells = 20,
  cellSize,
  isGameOver = false,
  tails = [],
  score = 0,
  maxScore = window.localStorage.getItem("maxScore") || undefined,
  particles = [],
  splashingParticleCount = 20,
  cellsCount,
  requestID;

let helpers = {
  Vec: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    mult(v) {
      if (v instanceof helpers.Vec) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
      } else {
        this.x *= v;
        this.y *= v;
        return this;
      }
    }
  },
  isCollision(v1, v2) {
    return v1.x == v2.x && v1.y == v2.y;
  },
  garbageCollector() {
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].size <= 0) {
        particles.splice(i, 1);
      }
    }
  },
  drawGrid() {
    CTX.lineWidth = 1.1;
    CTX.strokeStyle = "#f6f6f6";
    CTX.shadowBlur = 0;
    for (let i = 1; i < cells; i++) {
      let f = (W / cells) * i;
      CTX.beginPath();
      CTX.moveTo(f, 0);
      CTX.lineTo(f, H);
      CTX.stroke();
      CTX.beginPath();
      CTX.moveTo(0, f);
      CTX.lineTo(W, f);
      CTX.stroke();
      CTX.closePath();
    }
  },
  randHue() {
    return ~~(Math.random() * 360);
  },
  hsl2rgb(hue, saturation, lightness) {
    if (hue == undefined) {
      return [0, 0, 0];
    }
    var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    var huePrime = hue / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

    huePrime = ~~huePrime;
    var red;
    var green;
    var blue;

    if (huePrime === 0) {
      red = chroma;
      green = secondComponent;
      blue = 0;
    } else if (huePrime === 1) {
      red = secondComponent;
      green = chroma;
      blue = 0;
    } else if (huePrime === 2) {
      red = 0;
      green = chroma;
      blue = secondComponent;
    } else if (huePrime === 3) {
      red = 0;
      green = secondComponent;
      blue = chroma;
    } else if (huePrime === 4) {
      red = secondComponent;
      green = 0;
      blue = chroma;
    } else if (huePrime === 5) {
      red = chroma;
      green = 0;
      blue = secondComponent;
    }

    var lightnessAdjustment = lightness - chroma / 2;
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;

    return [
      Math.round(red * 255),
      Math.round(green * 255),
      Math.round(blue * 255)
    ];
  },
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }
};

let KEY = {
  W: false,
  A: false,
  S: false,
  D: false,
  resetState() {
    this.W = false;
    this.A = false;
    this.S = false;
    this.D = false;
  },
  listen() {
    addEventListener(
      "keydown",
      (e) => {
        if (e.key === "W" && this.S) return; // Prevent opposite directions
        if (e.key === "S" && this.W) return;
        if (e.key === "A" && this.D) return;
        if (e.key === "D" && this.A) return;

        this[e.key.toUpperCase()] = true; // Use key in uppercase
        Object.keys(this)
          .filter((f) => f !== e.key.toUpperCase() && f !== "listen" && f !== "resetState")
          .forEach((k) => {
            this[k] = false;
          });
      },
      false
    );
  }
};

class Snake {
  constructor(i, type) {
    this.pos = new helpers.Vec(W / 2, H / 2);
    this.dir = new helpers.Vec(0, 0);
    this.type = type;
    this.index = i;
    this.delay = 7;
    this.size = W / cells;
    this.color = "#adcf68";
    this.history = [];
    this.total = 1;
  }

  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.shadowBlur = 20;
    CTX.shadowColor = "rgba(255,255,255,.3 )";
    CTX.fillRect(x, y, this.size, this.size);
    CTX.shadowBlur = 0;
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        CTX.lineWidth = 1;
        CTX.fillStyle = "adcf68";
        CTX.fillRect(x, y, this.size, this.size);
        CTX.strokeStyle = "373737"; 
        CTX.strokeRect(x, y, this.size, this.size); 
      }
    }
  }

  walls() {
    let { x, y } = this.pos;
    if (x + cellSize > W) {
      this.pos.x = 0;
    }
    if (y + cellSize > W) {
      this.pos.y = 0;
    }
    if (y < 0) {
      this.pos.y = H - cellSize;
    }
    if (x < 0) {
      this.pos.x = W - cellSize;
    }
  }

  controlls() {
    let dir = this.size;
    if (KEY.W) {
      this.dir = new helpers.Vec(0, -dir);
    }
    if (KEY.S) {
      this.dir = new helpers.Vec(0, dir);
    }
    if (KEY.A) {
      this.dir = new helpers.Vec(-dir, 0);
    }
    if (KEY.D) {
      this.dir = new helpers.Vec(dir, 0);
    }
  }

  selfCollision() {
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      if (helpers.isCollision(this.pos, p)) {
        isGameOver = true;
      }
    }
  }

  update() {
    this.walls();
    this.draw();
    this.controlls();
    if (!this.delay--) {
      if (helpers.isCollision(this.pos, food.pos)) {
        incrementScore();
        particleSplash();
        food.spawn();
        this.total++;
      }
      this.history[this.total - 1] = new helpers.Vec(this.pos.x, this.pos.y);
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1];
      }
      this.pos.add(this.dir);
      this.delay = 7;
      this.total > 3 ? this.selfCollision() : null;
    }
  }
}

class Food {
  constructor() {
    this.pos = new helpers.Vec(
      ~~(Math.random() * cells) * cellSize,
      ~~(Math.random() * cells) * cellSize
    );
    this.color = "#db6666";
    this.size = cellSize;
  }
  draw() {
    let { x, y } = this.pos;
    CTX.globalCompositeOperation = "lighter";
    CTX.shadowColor = this.color;
    CTX.fillStyle = this.color;
    CTX.beginPath();
    CTX.arc(x + this.size / 2, y + this.size / 2, this.size / 2, 0, Math.PI * 2);
    CTX.fill();
    CTX.globalCompositeOperation = "source-over";
    CTX.shadowBlur = 0;
  }
  spawn() {
    let randX = ~~(Math.random() * cells) * this.size;
    let randY = ~~(Math.random() * cells) * this.size;
    for (let path of snake.history) {
      if (helpers.isCollision(path, new helpers.Vec(randX, randY))) {
        this.spawn();
        return;
      }
    }
    this.pos = new helpers.Vec(randX, randY);
  }
}

function particleSplash() {
  for (let i = 0; i < splashingParticleCount; i++) {
    let p = {
      pos: new helpers.Vec(snake.pos.x, snake.pos.y),
      size: Math.random() * 2 + 1,
      speed: new helpers.Vec(
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      ),
      color: "hsla(" + currentHue + ", 100%, 50%, 0.7)",
      life: Math.random() * 20 + 20
    };
    particles.push(p);
  }
}

function incrementScore() {
  score++;
  dom_score.textContent = score;
  if (score > maxScore) {
    maxScore = score;
    window.localStorage.setItem("maxScore", score);
  }
}

function reset() {
  currentHue = helpers.randHue();
  score = 0;
  dom_score.textContent = score;
  KEY.resetState();
  snake = new Snake();
  food = new Food();
  isGameOver = false;
  loop();
}

function loop() {
  CTX.clearRect(0, 0, W, H);
  helpers.drawGrid();
  snake.update();
  food.draw();
  helpers.garbageCollector();
  if (isGameOver) {
    CTX.fillStyle = "rgba(0, 0, 0, 0.6)";
    CTX.fillRect(0, 0, W, H);
    CTX.fillStyle = "white";
    CTX.font = "40px sans-serif";
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.fillText("Fim de jogo", W / 2, H / 2);
    CTX.fillText(`Pontuação: ${score}`, W / 2, H / 1.5);
    cancelAnimationFrame(requestID);
    return;
  }
  requestID = requestAnimationFrame(loop);
}

function initialize() {
  console.log("Welcome to the Snake Game! Press W, A, S, D to start the game.");
  CTX.imageSmoothingEnabled = false;
  KEY.listen();
  cellsCount = cells * cells;
  cellSize = W / cells;
  snake = new Snake();
  food = new Food();
  dom_replay.addEventListener("click", reset, false);
  loop();
}

initialize();
