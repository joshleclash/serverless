class Employee{
    constructor(employeeid,name,age,cargo){
        this.employeeid;
        this.name;
        this.age;
        this.cargo;
    }
    get(){
        return {employeeid:this.employeeid,age:this.age,name:this.name,cargo:this.cargo}
    }
}
module.exports = Employee;
