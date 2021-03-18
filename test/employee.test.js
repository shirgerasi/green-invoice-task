'use strict';

const needle = require('needle');
const Chai = require('chai');

const expect = Chai.expect;

const server = require('../src/server');
const dbPromise = require('../src/mongodb').db;

const postEmployee = async (payload) => {
  return await needle('post', 'http://localhost:5746/employee', payload, { json: true });
}

describe('Company Service', () => {
  describe('POST /employee', () => {
    before(async () => {
      this.server = server.init();
      this.db = await dbPromise;
    });

    afterEach(async () => {
      await this.db.collection('employees').drop();
    });

    after(async () => {
      await this.server.close();
    });

    it('should add an employee', async () => {
      const employee = {
        employeeId: 111,
        name: "shir",
        email: "shir@gmail.com"
      };   

      const res = await postEmployee(employee);
      expect(res.statusCode).to.equal(200);
    })

    it('should not add an employee when the data is not valid', async () => {
      const employee = {
        employeeId: 222,
        name: "shir",
        email: "shir"
      };

      const res = await postEmployee(employee);
      expect(res.statusCode).to.equal(400);
    })

    it('should not add an employee when id already exists', async () => {
      const employee = {
        employeeId: 111,
        name: "shir",
        email: "shir@gmail.com"
      };   

      let res = await postEmployee(employee);   
      expect(res.statusCode).to.equal(200);
      res = await postEmployee(employee);
      expect(res.statusCode).to.equal(409);
    })
  })
})
