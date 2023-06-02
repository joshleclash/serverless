const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
require('dotenv').config();


const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/empleado", async function (req, res) {
  const params = {
    TableName: USERS_TABLE
  };

  try {
    const items = await dynamoDbClient.scan(new GetCommand(params));
    if (items) {
      let response = items.map(x=>{return x.userId,x.name,x.cargo,x.edad})
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
app.get("/empleado/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
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
    const { userId, name,cargo,edad } = req.body;
    if (typeof userId !== "string") {
      res.status(400).json({ error: '"userId" must be a string' });
    } else if (typeof name !== "string") {
      res.status(400).json({ error: '"name" must be a string' });
    }
  
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId: userId,
        name: name,
        cargo: cargo,
        edad: edad
      },
    };
  
    try {
      await dynamoDbClient.send(new PutCommand(params));
      res.json({ userId, name,cargo,edad });
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
if(process.env.ENVIRONMENT=="LOCAL")
{
  app.listen(8080,()=>{
    console.log('Estamos escuchando');
  })
}
else{
  module.exports.handler = serverless(app);
}


