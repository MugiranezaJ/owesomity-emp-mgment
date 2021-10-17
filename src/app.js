import express from "express";
import routes from "./routes";
import ApplicationError from "./utils/applicationError";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))

const db = require("./models");
db.sequelize.sync();
// db.sequelize.sync({force:true});
app.use("/v1/", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to MugiranezaJ Systems",
    status: "success",
  });
});

// catch all 404 errors
app.all('*', (req, res, next) => {
  const err = new ApplicationError('Page Requested not found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message });
  // next(err); // log to the treminal
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log("server up and running");
});

