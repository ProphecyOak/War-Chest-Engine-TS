import Express = require("express");
import * as boardLayouts from "./board/Layouts";

const app = Express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
