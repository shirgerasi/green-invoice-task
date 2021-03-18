'use strict';

const { validationResult } = require('express-validator');
const dbPromise = require('./mongodb').db;

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    res.end();
  }
}

exports.addEmployee = async (req, res) => {
  const { employeeId, name, email } = req.body;

  try {
    const db = await dbPromise;
    validate(req, res);

    const employeeExists = await db.collection('employees').findOne({ employeeId });
    if (employeeExists) { 
      res.status(409).json({ err: new Error(`Employee with id ${ employeeId } already exist.`)});
      res.end();
    }
     
    await db.collection('employees').insertOne({ employeeId, name, email });
    
    res.status(200);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}

exports.addManager = async (req, res) => {
  const { managerId, name, email } = req.body;

  try {
    const db = await dbPromise;
    validate(req, res);

    const managerExists = await db.collection('managers').findOne({ managerId });
    if (managerExists) { 
      res.status(409).json({ err: new Error(`Manager with id ${ managerId } already exist.`)});
      res.end();
    }
     
    await db.collection('managers').insertOne({ managerId, name, email });
    
    res.status(200);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}

exports.addDepartment = async (req, res) => {
  const { departmentId, name } = req.body;

  try {
    const db = await dbPromise;
    validate(req, res);

    const departmentExists = await db.collection('departments').findOne({ departmentId });
    if (departmentExists) {  
      return res.status(409).json({ err: new Error(`Department with id ${ departmentId } already exist.`)});
    }

    await db.collection('departments').insertOne({ departmentId, name });
    
    res.status(200);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}

exports.assignEmployeeToManager = async (req, res) => {
  const { employeeId, managerId } = req.body;

  try {
    const db = await dbPromise;
    validate(req, res);

    const employeeExists = await db.collection('employees').findOne({ employeeId });
    if (!employeeExists) {  
      return res.status(404).json({ err: new Error(`Employee with id ${ employeeId } does not exist.`)});
    }

    const managerExists = await db.collection('managers').findOne({ managerId });
    if (!managerExists) {  
      return res.status(404).json({ err: new Error(`Manager with id ${ managerId } does not exist.`)});
    }

    await db.collection('employees').updateOne({ employeeId } , { $set: { managerId } });
    
    res.status(200);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}

exports.assignManagerToDepartment = async (req, res) => {
  const { departmentId, managerId } = req.body;

  try {
    const db = await dbPromise;
    validate(req, res);

    const departmentExists = await db.collection('departments').findOne({ departmentId });
    if (!departmentExists) {  
      return res.status(404).json({ err: new Error(`Department with id ${ departmentId } does not exist.`)});
    }

    const mangerExists = await db.collection('managers').findOne({ managerId });
    if (!mangerExists) {  
      return res.status(404).json({ err: new Error(`Manager with id ${ managerId } does not exist.`)});
    }

    await db.collection('managers').updateOne({ managerId } , { $set: { departmentId } });
    
    res.status(200);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}

exports.getBiggestDepartment = async (req, res) => {
  try {
    const db = await dbPromise;

    const numOfEmployees = await db.collection('departments').aggregate([
      { 
        $lookup: { 
            from: 'managers', 
            localField: 'departmentId', 
            foreignField: 'departmentId',
            as: 'managers'
        }
      }, 
      {   
        $unwind: '$managers'
      },
      {
        $lookup: {
            from: 'employees',
            localField: 'managers.managerId',
            foreignField: 'managerId',
            as: 'employees'
        }
      },
      {   
        $project: {
            _id : 1,
            departmentId : 1,
            name : 1,
            numOfEmployees : { $size: '$employees' },
        } 
      },
      {
        $sort: {
          numOfEmployees: -1
        }
      }
    ]).toArray();

    res.status(200).json(numOfEmployees[0]);
    res.end();
  }
  catch (err) {
    res.status(err.status || 500).json({ err });
    res.end();
  }
}