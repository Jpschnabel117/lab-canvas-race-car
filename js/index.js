const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let roadImg = new Image();
roadImg.src = "/images/road.png";

let carImg = new Image();
carImg.src = "/images/car.png";

let mineImg = new Image();
mineImg.src = "/images/mine.png";

let explodeImg = new Image();
explodeImg.src = "/images/explode.gif";

function clearCanvas() {
  ctx.clearRect(0, 0, 500, 700);
}
function drawCanvas() {
  //ctx.drawImage(roadImg, 0, 0, 500, 700);
  gamer.draw();
}

class playerCar {
  constructor() {
    this.w = 25;
    this.h = 50;
    this.speed = 3;
    this.lives = 3;
    this.xCord = 235;
    this.yCord = 650;
    this.img = carImg;
    this.score = 0;
  }
  controls() {
    let localidLeft;
    let localidRight;
    let localidUp;
    let localidDown;
    let moveIntervalLeft = true;
    let moveIntervalRight = true;
    let moveIntervalUp = true;
    let moveIntervalDown = true;
    let pollingRate = 8;
    window.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "ArrowLeft":
          if (moveIntervalLeft) {
            localidLeft = setInterval(() => {
              if (this.xCord > 0) {
                this.xCord = this.xCord - this.speed;
              }
            }, pollingRate);
            moveIntervalLeft = false;
          }
          break;
        case "ArrowRight":
          if (moveIntervalRight) {
            localidRight = setInterval(() => {
              if (this.xCord + 25 < 500) {
                this.xCord = this.xCord + this.speed;
              }
            }, pollingRate);
            moveIntervalRight = false;
          }
          break;
        case "ArrowUp":
          if (moveIntervalUp) {
            localidUp = setInterval(() => {
              if (this.yCord > 0) {
                this.yCord = this.yCord - this.speed;
              }
            }, pollingRate);
            moveIntervalUp = false;
          }
          break;
        case "ArrowDown":
          if (moveIntervalDown) {
            localidDown = setInterval(() => {
              if (this.yCord + 50 < 700) {
                this.yCord = this.yCord + this.speed;
              }
            }, pollingRate);
            moveIntervalDown = false;
          }
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      console.log(event);
      const key = event.key;
      switch (key) {
        case "ArrowLeft":
          clearInterval(localidLeft);
          moveIntervalLeft = true;
          break;
        case "ArrowRight":
          clearInterval(localidRight);
          moveIntervalRight = true;
          break;
        case "ArrowUp":
          clearInterval(localidUp);
          moveIntervalUp = true;
          break;
        case "ArrowDown":
          clearInterval(localidDown);
          moveIntervalDown = true;
          break;
      }
    });

    //clearCanvas();
    //drawCanvas();
  }

  draw() {
    ctx.drawImage(this.img, this.xCord, this.yCord, this.w, this.h);
  }
}

class mine {
  constructor(id) {
    this.w = 75;
    this.h = 75;
    this.wHIT = 45;
    this.hHIT = 45;
    this.speed = 1;
    this.id = id;
    this.xCord = Math.floor(Math.random() * canvas.width);
    this.yCord = 0;
    this.img = mineImg;
    this.intID = 0;
  }
  draw() {
    ctx.drawImage(this.img, this.xCord, this.yCord, this.w, this.h);
  }
}
function endGame(mineSpot) {
  clearInterval(mainCanvasInterval);
  for (const interval of mineIntervalArray) {
    clearInterval(interval);
  }
  ctx.clearRect(mineSpot.xCord, mineSpot.yCord, mineSpot.w, mineSpot.h);
  ctx.drawImage(explodeImg, mineSpot.xCord - 30, mineSpot.yCord, 150, 150);
}
let mineArray = [];
let gamer = new playerCar();
let mainCanvasInterval = 0;
let mineIntervalArray = [];
window.onload = () => {
  drawCanvas();
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
  gamer.controls();
  function startGame() {
    mainCanvasInterval = setInterval(function () {
      clearCanvas();
      drawCanvas();
      // collision and deletions, could be seperate functions
      for (let i = 0; i < mineArray.length; i++) {
        //bomb touches floor
        if (mineArray.length > 0) {
          mineArray[i].draw();
          mineArray[i].yCord += mineArray[i].speed;
          if (mineArray[i].yCord > 650) {
            mineArray.splice(i, 1);
            gamer.score++;
          }
          if (
            gamer.xCord < mineArray[i].xCord + mineArray[i].wHIT &&
            gamer.xCord + gamer.w > mineArray[i].xCord &&
            gamer.yCord < mineArray[i].yCord + mineArray[i].hHIT &&
            gamer.h + gamer.yCord > mineArray[i].yCord
          ) {
            console.log("U DIED");
            endGame(mineArray[i]);
          }
        }
      }
    }, 8);
    let mineCounter = 0;
    mineInterval = setInterval(function () {
      mineCounter++;
      let currentMine = new mine(mineCounter);
      mineArray.push(currentMine);
      mineIntervalArray.push(mineInterval);
    }, 1000);
  }
};
