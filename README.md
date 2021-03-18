# green-invoice-task

## Getting Started

- Install all dependencies
```shell
$ npm install
```


- Start the server

```shell
$ npm start
```

The server will run on port `5476` by default.

- Run the tests

```shell
$ npm test
```


## Project Structure

The service DB is implemented with `MongoDB`.
After starting the server the database, called `company`, gets created locally, and can be seen once the user adds a document to it (whether it is done manually or by calling one of the server APIs).

In order to get shell access to the DB install `MongoDB` using [these instructions](https://docs.mongodb.com/manual/mongo/).
Then type the following in your terminal:
```shell
$ mongo
> use company
```

The DB is constructed with the following collections:
 * `employees`
    ```json
    {
        employeeId: string,
        name: string,
        email: string
    }
    ```
 * `managers`
    ```json
    {
        managerId: string,
        name: string,
        email: string
    }
    ```
 * `departments`
    ```json
    {
        departmentId: string,
        name: string
    }
    ```

## API

- `POST /employee`
    ```json
    payload: {
        employeeId: string,
        name: string,
        email: string
    }
    ```
    Adds a new employee.

- `POST /manager`
    ```json
    payload: {
        managerId: string,
        name: string,
        email: string
    }
    ```
    Adds a new manager.

- `POST /department`
    ```json
    payload: {
        departmentId: string,
        name: string
    }
    ```
    Adds a new department.

- `PUT /manager/assign`
    ```json
    payload: {
        managerId: string,
        employeeId: string
    }
    ```
    Assigns an employee to a manager.
    The `managerId` is saved in the `employee` object in the database.

- `PUT /department/assign`
    ```json
    payload: {
        departmentId: string,
        managerId: string
    }
    ```
    Assigns an employee to a department.
    The `departmentId` is saved in the `manager` object in the database.

- `GET /department/biggest`
    Returns the department with the most employees.


## Future Ideas
* Divide handlers by route "areas".
* Create a test data object to generate data from instead of manually calling the routes, so that the test scenario will be clearer.
* Make all hardcoded variables (such as `port` and `dbName`) configurable.
* Support deployment with a Dockerfile.
* Cover more edge cases and scenarios in the tests.
* Add a proper linter.