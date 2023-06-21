const express = require("express");
const app = express();
const port = 8008;
app.use(express.static("dist", { maxAge: 1000 * 3600 }));
app.listen(port, () => console.log(`Example app listening on port port!`));
