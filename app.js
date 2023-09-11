function inBounds(move) {
  return move[0] >= 0 && move[0] <= 7 && move[1] >= 0 && move[1] <= 7;
}

let traversed = new Set(); // for preventing loops and redundancies
class Square {
  constructor(coords, parent) {
    this.coords = coords;
    this.parent = parent;
  }

  generateChildren() {
    const knightOffsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    // use knight offsets to find and filter possible moves
    this.children = knightOffsets
      .map((offset) => [this.coords[0] + offset[0], this.coords[1] + offset[1]])
      .filter((move) => this.moveIsLegal(move))
      .map((move) => new Square(move, this));

    // add all new squares to traversed
    this.children.forEach((square) => traversed.add(square.coords));
  }

  // check immediate nodes for target coordinates
  search(target) {
    return this.children.find(
      (square) => square.coords[0] == target[0] && square.coords[1] == target[1]
    );
  }

  moveIsLegal(move) {
    // check move is in bounds and hasn't been traversed
    return inBounds(move) && !traversed.has(move);
  }
}

// input two chess board coordinates
// output a moveset of knight moves from start to target
function knightMoves(start, target) {
  if (start[0] == target[0] && start[1] == target[1]) {
    console.log("choose two different squares!");
    return;
  } else if (!inBounds(start) || !inBounds(target)) {
    console.log("use coordinates in bound!");
    return;
  }

  let resultString = `Looking for a knight's route from ${start} to ${target}`;

  let queue = []; 
  let root = new Square(target);
  let tmpSquare = root;
  let match;

  while(tmpSquare) {
    tmpSquare.generateChildren();
    match = tmpSquare.search(start);
    if(match) break;
    
    tmpSquare.children.forEach((child) => queue.push(child));
    tmpSquare = queue.shift();
  }
  
  if(match) {
    resultString += "\nFound a route! use the moves:"
    tmpSquare = match;
    while(tmpSquare) {
      resultString += `\n${tmpSquare.coords}`;
      tmpSquare = tmpSquare.parent;
    }
  
  } else {
    resultString += "\nWe couldn't find a route..."
  }
  
  console.log(resultString);

  // cleanup
  traversed.clear();
}

// tests
knightMoves([0, 0], [7, 7]);
knightMoves([0, 0], [3, 7]);
knightMoves([-1, 0], [3, 7]);
knightMoves([0, 0], [5, 7]);
knightMoves([0, 0], [1, 0]);
knightMoves([0, 8], [3, 7]);
knightMoves([0, 0], [1, 2]);
knightMoves([0, 0], [2, 2]);
