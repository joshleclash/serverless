const EmployeeRepository = require("../repositories/employee_repository");
const employeeRepository = new EmployeeRepository();
class EmployeeController {
  async getEmployee(req, res) {
    try {
      let response = await employeeRepository.get();
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
  }
  async getEmployeeById(req, res) {
    let { employeeid } = req.params;
    console.log(employeeid);
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
  }

  async createEmployee(req, res) {
    const { employeeid, name, cargo, age } = req.body;
    if (typeof employeeid !== "string") {
      res.status(400).json({ error: '"employeeid" must be a string' });
    } else if (typeof name !== "string") {
      res.status(400).json({ error: '"name" must be a string' });
    }
    if (typeof cargo !== "string") {
      res.status(400).json({ error: '"cargo" must be a string' });
    } else if (typeof age !== "string") {
      res.status(400).json({ error: '"age" must be a string' });
    }

    try {
      let response = await employeeRepository.create(
        employeeid,
        name,
        age,
        cargo
      );
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }
}
module.exports = EmployeeController;
