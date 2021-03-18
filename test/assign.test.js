'use strict';

const needle = require('needle');
const Chai = require('chai');

const expect = Chai.expect;

const server = require('../src/server');
const dbPromise = require('../src/mongodb').db;

const createTestEmployees = async () => {
  await needle('post', 'http://localhost:5746/employee', { employeeId: "111", name: "111", email: "11@gmail.com" }, { json:true });
  await needle('post', 'http://localhost:5746/employee', { employeeId: "222", name: "222", email: "22@gmail.com" }, { json:true });
  await needle('post', 'http://localhost:5746/employee', { employeeId: "333", name: "333", email: "33@gmail.com" }, { json:true });
}

const createTestManagers = async () => {
  await needle('post', 'http://localhost:5746/manager', { managerId: "1", name: "111", email: "1@gmail.com" }, { json:true });
  await needle('post', 'http://localhost:5746/manager', { managerId: "2", name: "222", email: "2@gmail.com" }, { json:true });
}

const createTestDepartment = async () => {
  await needle('post', 'http://localhost:5746/department', { departmentId: "01", name: "111" }, { json:true });
  await needle('post', 'http://localhost:5746/department', { departmentId: "02", name: "111" }, { json:true });
}

const createBiggestDepartmentData = async () => {
  await needle('put', 'http://localhost:5746/manager/assign', { managerId: "1", employeeId: "111" }, { json:true });
  await needle('put', 'http://localhost:5746/manager/assign', { managerId: "1", employeeId: "222" }, { json:true });
  await needle('put', 'http://localhost:5746/manager/assign', { managerId: "2", employeeId: "333" }, { json:true });

  await needle('put', 'http://localhost:5746/department/assign', { managerId: "1" ,departmentId: "01" }, { json:true });
  await needle('put', 'http://localhost:5746/department/assign', { managerId: "2" ,departmentId: "02" }, { json:true });
}

describe('Company Service', () => {
  describe('PUT /assign', () => {
    before(async () => {
      this.server = server.init();
      this.db = await dbPromise;
    })

    beforeEach(async () => {
      await createTestEmployees();
      await createTestManagers();
      await createTestDepartment();
    })

    afterEach(async () => {
      await this.db.collection('employees').drop();
      await this.db.collection('managers').drop();
      await this.db.collection('departments').drop();
    })

    after(async () => {
      await this.server.close();
    })

    it('should assign manager to an employee', async () => {
      const payload = {
        managerId: "1",
        employeeId: "111"
      }   ;   

      const res = await needle('put', 'http://localhost:5746/manager/assign', payload, { json:true });
      expect(res.statusCode).to.equal(200);

      const employee = await this.db.collection('employees').findOne({ employeeId: payload.employeeId });
      expect(employee.managerId).to.equal(payload.managerId);
    })

    it('should assign department to a manager', async () => {
      const payload = {
        managerId: "1",
        departmentId: "01"
      };    

      const res = await needle('put', 'http://localhost:5746/department/assign', payload, { json:true });
      expect(res.statusCode).to.equal(200);

      const manager = await this.db.collection('managers').findOne({ managerId: payload.managerId });
      expect(manager.departmentId).to.equal(payload.departmentId);
    })

    it('should return the department with most employees', async () => {
      await createBiggestDepartmentData();

      const res = await needle('get', 'http://localhost:5746/department/biggest');
      expect(res.statusCode).to.equal(200);
      expect(res.body.numOfEmployees).to.equal(2);
    })
  })
})
