const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();
const app = express();
const EmployeeController = require("./src/controllers/employee.controller");
const employeeController = new EmployeeController();
app.use(express.json());
app.get("/empleado", async function (req, res) {
  return await employeeController.getEmployee(req, res);
});
app.get("/empleado/:employeeid", async function (req, res) {
  return await employeeController.getEmployeeById(req, res);
});

app.post("/empleado", async function (req, res) {
  return await employeeController.createEmployee(req, res);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
console.log(process.env.ENVIRONMENT);
if (process.env.ENVIRONMENT == "LOCAL") {
  app.listen(process.env.PORT, () => {
    console.log(`estamos escuchando on ${process.env.PORT}`);
  });
} else {
  module.exports.handler = serverless(app);
}
