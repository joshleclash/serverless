const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const path = require("path");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();
const app = express();
const EmployeeRepository = require("./src/repositories/employee_repository");
const USERS_TABLE = process.env.USERS_TABLE;
let client = new DynamoDBClient();
if (process.env.IS_OFFLINE) {
  client = new DynamoDBClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
  });
}
const dynamoDbClient = DynamoDBDocumentClient.from(client);
const employeeRepository = new EmployeeRepository();
app.use(express.json());
app.get("/empleado", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
  };
  try {
    let response = employeeRepository.get();
    if (response) {
      res.json(response);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});
app.get("/empleado/:employeeid", async function (req, res) {
  let {employeeid} = req.params;
  if (typeof employeeid !== "string") {
    res.status(400).json({ error: '"employeeid" must be a string' });
  }
  try {
    let response = await employeeRepository.getById(employeeid);
    if (response) {
      return res.status(200).json(response);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/empleado", async function (req, res) {
  const { employeeid, name, cargo, edad } = req.body;
  if (typeof employeeid !== "string") {
    res.status(400).json({ error: '"employeeid" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }
  if (typeof cargo !== "string") {
    res.status(400).json({ error: '"cargo" must be a string' });
  } else if (typeof edad !== "string") {
    res.status(400).json({ error: '"edad" must be a string' });
  }

  try {
    let response = await employeeRepository.create(employeeid, name, cargo, edad);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
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
