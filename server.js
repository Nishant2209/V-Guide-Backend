const mongoose = require("mongoose");
const url =
  "mongodb+srv://Nishant2209:Manash%402209@v-guide.jr59x5s.mongodb.net/vguide";

const connectToMongo = () => {
  mongoose.connect(url, () => {
    console.log("Connected !!!");
  });
};

module.exports = connectToMongo;
