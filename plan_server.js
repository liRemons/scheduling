const express = require("express");
const path = require('path')
const app = express();
const port = 8008;
app.use(express.static("dist", { maxAge: 1000 * 3600 }));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'))
})
app.listen(port, () => console.log(`Example app listening on port port!`));
