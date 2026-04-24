import Express = require("express");
import * as boardLayouts from "./board/Layouts";
import * as units from "./unit/Units";
import { EventBus } from "./game/eventBus";
import { Coordinate } from "./board/coordinate";
import { Coin } from "./coin/coin";

const app = Express();
const PORT = 3000;

let myBoard = new boardLayouts.Vanilla();
let pikemanLocation = new Coordinate(4, 4);
myBoard.getHex(pikemanLocation).coinStack.addCoin(new Coin("pikeman", 0));
let swordsmanLocation = new Coordinate(4, 3);
myBoard.getHex(swordsmanLocation).coinStack.addCoin(new Coin("swordsman", 1));

let PikemanUnit = new units.Vanilla.Pikeman(0);
PikemanUnit.boardLocations.push(pikemanLocation);
let SwordsmanUnit = new units.Vanilla.Swordsman(1);
SwordsmanUnit.boardLocations.push(swordsmanLocation);

PikemanUnit.unitActionsAvailable(myBoard).forEach((x) =>
  console.log(JSON.stringify(x, undefined, 1)),
);
console.log();
SwordsmanUnit.unitActionsAvailable(myBoard).forEach((x) =>
  console.log(JSON.stringify(x, undefined, 1)),
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
