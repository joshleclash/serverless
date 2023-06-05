const Employee = require("../models/employee");
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

  async create(employeeid,name,cargo,edad) {
    const params = {
      TableName: this.tableName,
      Item: {
        employeeid: employeeid,
        name: name,
        cargo: cargo,
        edad: edad,
      },
    };
    await this.dynamoDbClient.send(new PutCommand(params));
    return {success:true,data:params.Item}
  }

  async get() {
    const params = {
        TableName: this.tableName,
      };
    const items = await this.dynamoDbClient.send(new ScanCommand(params));
    console.log(items);
    let response;
    if (items) {
      console.log("aca estamos")
      response = items.Items.map((x) => {
        let empployee = new Employee(x.employeeid,  x.name,  x.cargo, x.edad );
        return  empployee.get()
      });
    }
    console.log(response)
    return response;
  }
  async getById(employeeid) {
    const params = {
      TableName: this.tableName,
      Key: {
        employeeid: employeeid
      }
    };
    console.log(params);
    let data = await this.dynamoDbClient.send(new GetCommand(params));
    console.log(data)
    return {success:true,data:data.Item}
  }
}

module.exports = EmployeeRepository;