import Express = require("express");

const app = Express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
