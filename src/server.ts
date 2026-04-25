import Express = require("express");
import * as boardLayouts from "./board/Layouts";
import * as units from "./unit/Units";
import { Coordinate } from "./board/coordinate";
import { Coin } from "./coin/coin";

const app = Express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
