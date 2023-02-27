const connectToMongo = require("./server");
const express = require("express");
var cors = require("cors");
connectToMongo();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", require(`./routes/auth`));

app.listen(port, () => {
  console.log(`V-Guide backend listening on http://localhost:${port}`);
});
