const mongoose = require('mongoose');
const uri = "mongodb+srv://arnavnawade_db_user:Arnav180606@cluster0.p5prb2c.mongodb.net/kinetic-fitness?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("CONNECTION ERROR:", err.message);
    process.exit(1);
  });
