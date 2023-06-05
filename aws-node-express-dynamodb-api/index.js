const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
let client = new DynamoDBClient();
if (process.env.IS_OFFLINE) {
  client = new DynamoDBClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
  });
}
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
app.get("/empleado", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
  };
  console.log(params)
  try {
    const items = await dynamoDbClient.send(new ScanCommand(params));
    console.log(items.Items);
    if (items) {
      let response = items.Items.map((x) => {
        return {id:x.employeeid, name:x.name, cargo:x.cargo, age:x.edad};
      });
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
  const params = {
    TableName: USERS_TABLE,
    Key: {
      employeeid: req.params.employeeid,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { employeeid, name, edad, cargo } = Item;
      res.json({ employeeid, name, edad, cargo });
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

  const params = {
    TableName: USERS_TABLE,
    Item: {
      employeeid: employeeid,
      name: name,
      cargo: cargo,
      edad: edad,
    },
  };
  console.log(params);
  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ employeeid, name, cargo, edad });
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
