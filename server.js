const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// (async function () {
//   await mongoose
//     .connect(DB, {
//       // .connect(process.env.DATABASE_LOCAL, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("DB connection successful!"));
// })();

async function run() {
  await mongoose
    .connect(
      "mongodb+srv://robinrh656:PrFbaFod95Ql1eXT@cluster0.yroiteb.mongodb.net/natours?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("DB connection successfully");
    });
}

run();
mongoose.set("bufferCommands", false);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
