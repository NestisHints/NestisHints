var context = document.getElementById('puzzle').getContext('2d');
var canvas = document.getElementById('puzzle');
var music = new Audio('resources/music.mp3');

var img = new Image();
img.src = 'img/puzzle.jpg';

canvas.style.background = "#000";
canvas.height = window.innerHeight;
canvas.width = (window.innerHeight / 100) * 60;

img.addEventListener('load', drawTiles, false);

var boardSizeX = document.getElementById('puzzle').width;
var boardSizeY = document.getElementById('puzzle').height;
var tileCount = document.getElementById('scale').value;

var tileSizeX = boardSizeX / tileCount;
var tileSizeY = boardSizeY / tileCount;

var imageTileX = img.width / tileCount;
var imageTileY = img.height / tileCount;

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var time = 0;
var clicks = 0;
var timeInterval;

var firstClick = true;

var boardParts;
setBoard();

function playMusic() {
  music.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  music.play();
}

//CHANGE DIFFICULTY
document.getElementById('scale').onchange = function() {
  tileCount = this.value;
  tileSizeX = boardSizeX / tileCount;
  tileSizeY = boardSizeY / tileCount;
  setBoard();
  drawTiles();
};

//TILE CLICK
document.getElementById('puzzle').onclick = function(e) {
  //Get clicked tile
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSizeX);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSizeY);

  //Check if tile is movable
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }

  //Check if the player has won
  if (solved) {
    setTimeout(function() {alert("You solved it!");}, 500);
  }

  //Update # of clicks
  clicks++;
  updateText('clicks', clicks);

  //TEMPORARY! REMOVE WHEN MENU IS MADE
  if (firstClick) {
    startGame();
    playMusic();
    firstClick = false;
  }
};

//INITIAL BOARD CREATION
//TILES ARE IN OPPOSITE SPOTS INSTEAD OF RANDOM SHUFFLING
function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = new Object;
      boardParts[i][j].x = (tileCount - 1) - i;
      boardParts[i][j].y = (tileCount - 1) - j;
    }
  }
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
  solved = false;
}

//DRAW TILES FROM IMAGE TO VIEWPORT
function drawTiles() {
  context.clearRect ( 0 , 0 , boardSizeX , boardSizeY );
  var imageTileX = img.width / tileCount;
  var imageTileY = img.height / tileCount;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(img, x * imageTileX, y * imageTileY, imageTileX, imageTileY,
            i * tileSizeX, j * tileSizeY, tileSizeX, tileSizeY);
      }
    }
  }
}

//CALCULATE DISTANCE BETWEEN TILES
function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

//MOVE TILE
function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    checkSolved();
  }
}

//CHECK IF SOLVED
function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}

//START TIMER ON GAMESTART
function startGame() {
  timeInterval = setInterval(function(){time++;updateText('time', time);}, 1000);
}

//UPDATE UI
function updateText(textField, newText) {
  document.getElementById(textField).innerHTML = textField + ": " + newText;
}

//RESET GAME
function resetGame() {
  clearInterval(timeInterval);
  time = 0;
  updateText('time', time);
  clicks = 0;
  updateText('clicks', clicks);
  setBoard();
  drawTiles();
  firstClick = true;
}

function GameMenu(menuType) {
  var menu = document.getElementById("gamemenu");

  switch (menuType) {
    case 0:
      //HIDE
      menu.style.display = "none";
      break;
    case 1:
      //SHOW MAIN MENU
      menu.style.display = "block";
      break;
    default:
      //HIDE
      menu.style.display = "none";
      break;

  }
}
