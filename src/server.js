'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

const { addEmployee } = require('./routes');
const { addManager } = require('./routes');
const { addDepartment } = require('./routes');
const { assignEmployeeToManager } = require('./routes');
const { assignManagerToDepartment } = require('./routes');
const { getBiggestDepartment } = require('./routes');

const port = 5746;
const app = express();

exports.init = () => {
  app.use(bodyParser.json());

  app.post('/employee',
    body('employeeId').not().isEmpty(),
    body('name').not().isEmpty(),
    body('email').isEmail(),
    addEmployee
  );

  app.post('/manager',
    body('managerId').not().isEmpty(),
    body('name').not().isEmpty(),
    body('email').isEmail(),
    addManager
  );

  app.post('/department',
    body('departmentId').not().isEmpty(),
    body('name').not().isEmpty(),
    addDepartment
  );

  app.put('/manager/assign',
    body('managerId').not().isEmpty(),
    body('employeeId').not().isEmpty(),
    assignEmployeeToManager
  );

  app.put('/department/assign',
    body('managerId').not().isEmpty(),
    body('departmentId').not().isEmpty(),
    assignManagerToDepartment
  );

  app.get('/department/biggest', getBiggestDepartment);

  return app.listen(port, () => console.log(`Server is listening on port -> ${port}`));
}
