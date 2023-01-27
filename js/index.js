const canvas = document.querySelector("#canvas");
canvas.style.backgroundColor = "#4cae51";
canvas.style.border = "1px solid black";
const ctx = canvas.getContext("2d");

const startBtn = document.querySelector("#start");
const gameOverCanvas = document.querySelector(".game-over");
const restartBtn = document.querySelector("#restart");

const spriteImg = new Image();
spriteImg.src = "./assets/sprite.png";
const obstacleImg = new Image();
obstacleImg.src = "./assets/obstacle.png";
const coinImg = new Image();
coinImg.src = "./assets/coin.png";
const startGameImg = new Image();
startGameImg.src = "./assets/game_start.png";
const gameOverImg = new Image();
gameOverImg.src = "./assets/game_over.png";

const audio = new Audio("./audio/barn-beat-01.mp3");
audio.volume = 0.1;


let spritePositionY = canvas.height - 100;
let spritePositionX = 30;
const spriteWidth = 100;
const spriteHeight = 100;
let spriteMoveUp = 15;
let spriteDirectionY = spriteMoveUp;

let isSpriteGiongUp = false;
let isSpriteGiongDown = false;

let isGameOver = false;
let score = 1;
let animationFrameId;
let obstacles = [];

let obstacleSpeed = 5
let coinSpeed = 5


// let coin = 0;
let coins = [];


// Creating the obstacles
class obstacle{
  constructor(positionX, positionY, width, height){
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height; 

  }
  draw(){
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.positionX, this.positionY, this.width, this.height )
    ctx.drawImage( obstacleImg, this.positionX, this.positionY, this.width, this.height )
    
    if(score % 6 === 0){
      obstacleSpeed += 0.5;
    }
    this.positionX -= obstacleSpeed;
    // console.log(this.positionX)
  }
  checkCollision(){
    if(spritePositionX < this.positionX + this.width &&
      spritePositionX +spriteWidth > this.positionX &&
      spritePositionY < this.positionY + this.height &&
      spriteHeight + spritePositionY > this.positionY){

        isGameOver = true;

      }
  }
 
  
}

// Creating the coins
class randomCoin{
  constructor(positionX, positionY, width, height){
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height; 
  }
  // Drawing the coin
  drawCoins(){
    ctx.drawImage( coinImg, this.positionX, this.positionY, this.width, this.height )
    
    if(score % 6 === 0){
      coinSpeed += 0.5
    }
    this.positionX -= coinSpeed 
    ;
    
  }
  // Making counter of the coins 
  coinCollision(coin){
    if(spritePositionX < this.positionX + this.width &&
      spritePositionX +spriteWidth > this.positionX &&
      spritePositionY < this.positionY + this.height &&
      spriteHeight + spritePositionY > this.positionY){

        // coin += 1
        // console.log("score.....1",score)
        const index = coins.indexOf(coin)
        coins.splice(index+1, 1)
        console.log("index.....", index)
        score += 1
        

      }
  }

}

// Creating and drawing the sprite function
// function drawSprite() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.drawImage(
//     spriteImg,
//     spritePositionX,
//     spritePositionY,
//     spriteWidth,
//     spriteHeight
//   );
//   // Condition to check if the sprite is going up or down
//   if (isSpriteGiongUp) {
//     if (spritePositionY > 0) {
//       spritePositionY -= spriteMoveUp;
//     }
//   }
 
//   if (isSpriteGiongDown && spritePositionY < canvas.height - spriteHeight) {
//     // console.log(spritePositionY, "spr..................");
//     spritePositionY += 10;
//   }

  
// }

// Making animate for the sprite, obstacles and coins
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startGameImg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    spriteImg,
    spritePositionX,
    spritePositionY,
    spriteWidth,
    spriteHeight
  );
  // Condition to check if the sprite is going up or down
  if (isSpriteGiongUp) {
    if (spritePositionY > 0) {
      spritePositionY -= spriteMoveUp;
    }
  }
 
  if (isSpriteGiongDown && spritePositionY < canvas.height - spriteHeight) {
    // console.log(spritePositionY, "spr..................");
    spritePositionY += 10;
  }

  //calling the coinCollision method and draw method
  coins.forEach((coin) => {
    coin.coinCollision();
    coin.drawCoins() 
  })
  // calling the coinCollision method and draw method
  obstacles.forEach((obstacle) => {
    obstacle.checkCollision();
    // console.log("obstacle.positionX...",obstacle.positionX)
    obstacle.draw()
    
  })
  // console.log("score......3", score)
  // filter the obstacles that are out of the canvas
  obstacles = obstacles.filter((obstacle) => obstacle.positionX > -200)
  // console.log(obstacles)

  //  filter the coins that are out of the canvas
  coins = coins.filter((coin)=>coin.positionX > -100)

    // Add the obstacles to the array of obstacles 
  if(animationFrameId % 200 === 0){
    let addObstacle = new obstacle( canvas.width, (canvas.height-200) * Math.random(), 150,150)
    obstacles.push(addObstacle)
    
    // Add the coins to the array of coins 
  }else if(animationFrameId % 100 === 0){
    let addCoin =new randomCoin( canvas.width, (canvas.height - 100) * Math.random(), 100, 100)
    // console.log("coins.....",coins)
    coins.push(addCoin)

  }
  ctx.font = "50px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score:"+score, canvas.width - 200, 40);
  console.log("score.....2",score)


  gameOver()
  
}

function start() {
  startBtn.style.display = "none";
  canvas.style.display = "block";
  animate();
  audio.play();
}

function gameOver(){
  if(isGameOver){
    cancelAnimationFrame(animationFrameId);
    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", 420, 200);
    gameOverCanvas.style.display = "block";
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText( "Your score: " + score, 420, 300);
    // ctx.font = "50px Arial";
    restartBtn.style.display = "block";
    audio.pause();


  }else{
    animationFrameId = requestAnimationFrame(animate);
  }
}

function restart() {
  location.reload();
  // console.log("testing......")
  start()
}

window.addEventListener("load", () => {
  canvas.style.display = "none";
  restartBtn.style.display = "none";

  startBtn.addEventListener("click", () => {
    document.querySelector(".container-welcome").style.display = "none";
    start();
  });

  restartBtn.addEventListener("click", () => {
    restart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      isSpriteGiongDown = false;
      isSpriteGiongUp = true;
    }
    
  });

  document.addEventListener("keyup", (event) => {
    // console.log(event.code, "testing.....");
    isSpriteGiongUp = false;
    isSpriteGiongDown = true;
  });
});
