// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from "./server.js";

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Sneaky Phantoms", // TODO: Your Battlesnake Username
    color: "#F1F1F1", // TODO: Choose color
    head: "default", // TODO: Choose head
    tail: "default", // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

function matches(first, second) {
  return first.x == second.x && first.y == second.y;
}

function distance(first, second) {
  let dist = Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
  return dist;
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];
  const headUp = { x: myHead.x, y: myHead.y + 1 };
  const headDown = { x: myHead.x, y: myHead.y - 1 };
  const headRight = { x: myHead.x + 1, y: myHead.y };
  const headLeft = { x: myHead.x - 1, y: myHead.y };

  //Establish illegal moves
  {
    // We've included code to prevent your Battlesnake from moving backwards

    if (myNeck.x < myHead.x) {
      // Neck is left of head, don't move left
      isMoveSafe.left = false;
    } else if (myNeck.x > myHead.x) {
      // Neck is right of head, don't move right
      isMoveSafe.right = false;
    } else if (myNeck.y < myHead.y) {
      // Neck is below head, don't move down
      isMoveSafe.down = false;
    } else if (myNeck.y > myHead.y) {
      // Neck is above head, don't move up
      isMoveSafe.up = false;
    }

    // Prevent your Battlesnake from moving out of bounds

    let boardWidth = gameState.board.width;
    let boardHeight = gameState.board.height;

    if (myHead.x == 0) {
      isMoveSafe.left = false;
    }
    if (myHead.x == boardWidth - 1) {
      isMoveSafe.right = false;
    }
    if (myHead.y == 0) {
      isMoveSafe.down = false;
    }
    if (myHead.y == boardHeight - 1) {
      isMoveSafe.up = false;
    }

    let arrayOfSnakes = gameState.board.snakes;
    for (let i = 0; i < arrayOfSnakes.length; i++) {
      let curr = arrayOfSnakes[i];
      curr.body.forEach((currentBodyPos) => {
        if (matches(headUp, currentBodyPos)) {
          isMoveSafe.up = false;
        } else if (matches(headDown, currentBodyPos)) {
          isMoveSafe.down = false;
        } else if (matches(headRight, currentBodyPos)) {
          isMoveSafe.right = false;
        } else if (matches(headLeft, currentBodyPos)) {
          isMoveSafe.left = false;
        }
      });
    }
  }

  //done with illegal
  if (isMoveSafe.up) {
    gameState.board.snakes.forEach((snake) => {
      let otherSnakeHead = snake.body[0];
      if (!matches(otherSnakeHead, myHead)) {
        if (distance(otherSnakeHead, headUp) < 1.5) {
          console.log(distance(otherSnakeHead, headUp))
          if (snake.length >= gameState.you.body.length) {
            isMoveSafe.up = false;
          }
        }
      }
    });
  }
  if (isMoveSafe.down) {
    gameState.board.snakes.forEach((snake) => {
      let otherSnakeHead = snake.body[0];
      if (!matches(otherSnakeHead, myHead)) {
        if (distance(otherSnakeHead, headDown) < 1.5) {
          console.log(distance(otherSnakeHead, headDown))
          if (snake.length >= gameState.you.body.length) {
            isMoveSafe.down = false;
          }
        }
      }
    });
  }
  if (isMoveSafe.left) {
    gameState.board.snakes.forEach((snake) => {
      let otherSnakeHead = snake.body[0];
      if (!matches(otherSnakeHead, myHead)) {
        if (distance(otherSnakeHead, headLeft) < 1.5) {
          console.log(distance(otherSnakeHead, headLeft))
          if (snake.length >= gameState.you.body.length) {
            isMoveSafe.left = false;
          }
        }
      }
    });
  }
  if (isMoveSafe.right) {
    gameState.board.snakes.forEach((snake) => {
      let otherSnakeHead = snake.body[0];
      if (!matches(otherSnakeHead, myHead)) {
        if (distance(otherSnakeHead, headRight) < 1.5) {
          console.log(distance(otherSnakeHead, headRight))
          if (snake.length >= gameState.you.body.length) {
            isMoveSafe.right = false;
          }
        }
      }
    });
  }

  let dist = 100000;
  let closestFood;

  let arrayOfFood = gameState.board.food;
  arrayOfFood.forEach((food) => {
    let currDist = distance(food, myHead);

    if (currDist < dist) {
      dist = currDist;
      closestFood = food;
    }
  });

  let fooX = myHead.x - closestFood.x;
  let fooY = myHead.y - closestFood.y;

  if (Math.abs(fooX) > Math.abs(fooY)) {
    if (fooX > 0) {
      //want to move left
      if (isMoveSafe.left) {
        return { move: "left" };
      }
    } else {
      //want to move right
      if (isMoveSafe.right) {
        return { move: "right" };
      }
    }
  } else {
    if (fooY > 0) {
      //want to move down
      if (isMoveSafe.down) {
        return { move: "down" };
      }
    } else {
      //want to move up
      if (isMoveSafe.up) {
        return { move: "up" };
      }
    }
  }

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
