const EmployeeModel = require("../models/employee");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
class EmployeeRepository {
  tableName = process.env.USERS_TABLE;
  database = new DynamoDBClient();
  dynamoDbClient;
  constructor() {
    if (process.env.IS_OFFLINE) {
      this.database = new DynamoDBClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
      });
    }
    this.dynamoDbClient = DynamoDBDocumentClient.from(this.database);
  }

  async create(employeeid, name, age, cargo) {
    let params = {
      TableName: this.tableName,
      Item: {
        employeeid: employeeid,
        name: name,
        age: age,
        cargo: cargo,
      },
    };
    await this.dynamoDbClient.send(new PutCommand(params));
    return {
      success: true,
      data: new EmployeeModel(
        params.Item.employeeid,
        params.Item.name,
        params.Item.age,
        params.Item.cargo
      ).get(),
    };
  }

  async get() {
    let params = {
      TableName: this.tableName,
    };
    const items = await this.dynamoDbClient.send(new ScanCommand(params));

    return {
      success: true,
      data: items.Items.map((x) => {
        return new EmployeeModel(x.employeeid, x.name, x.age, x.cargo).get();
      }),
    };
  }
  async getById(employeeid) {
    let params = {
      TableName: "employee",
    };
    let data = await this.dynamoDbClient.send(new ScanCommand(params));
    let filter = data.Items.filter((x) => x.employeeid == employeeid);
    console.log(filter);
    return {
      success: true,
      data: filter.map((x) => {
        return new EmployeeModel(x.employeeid, x.name, x.age, x.cargo).get();
      }),
    };
  }
}

module.exports = EmployeeRepository;
