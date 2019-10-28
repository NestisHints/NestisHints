var context = document.getElementById('puzzle').getContext('2d');
var canvas = document.getElementById('puzzle');

var img = new Image();

canvas.style.background = "#fff";
canvas.height = window.innerHeight;

var imgs = [['img/game1.png', 60, 3], ['img/game2.png', 100, 4], ['img/game3.png', 100, 5], ['img/game4.png', 60, 6]];

var boardSizeX, boardSizeY, tileCount, tileSizeX, tileSizeY, imageTileX, imageTileY;

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var boardParts;
//setBoard();
var currentGame = 0;
gameSetup(currentGame);

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
    setTimeout(function() {
      alert("View the full image here: https://nestishints.github.io/" + imgs[currentGame][0]);
      currentGame++;
      gameSetup(currentGame);
    }, 500);
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

function gameSetup(game) {
  img.src = imgs[game][0];
  tileCount = imgs[game][2];
  canvas.width = window.innerHeight * (imgs[game][1] / 100);

  var newmargin = imgs[game][1] / 2;
  canvas.style.marginLeft = "-" + newmargin + "vh";

  boardSizeX = document.getElementById('puzzle').width;
  boardSizeY = document.getElementById('puzzle').height;
  tileSizeX = boardSizeX / tileCount;
  tileSizeY = boardSizeY / tileCount;

  imageTileX = img.width / tileCount;
  imageTileY = img.height / tileCount;

  img.addEventListener('load', drawTiles, false);
  setBoard();
}
