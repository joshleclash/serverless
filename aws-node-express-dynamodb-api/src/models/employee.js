class EmployeeModel {
  constructor(employeeid, name, age, cargo) {
    this.employeeid = employeeid;
    this.name = name;
    this.age = age;
    this.cargo = cargo;
  }
  get() {
    return {
      'employeeid': this.employeeid,
      'name': this.name,
      'age': this.age,
      'cargo': this.cargo,
    };
  }
}
module.exports = EmployeeModel;
