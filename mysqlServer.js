const MySQLEvents = require('@rodrigogs/mysql-events');
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const program = async () => {
  const app2 = express();
  const appServer = http.createServer(app2);
  const channel = socketIo(appServer);
  const port = 3001;

  const xmppSw = 'ec2-15-185-52-27.me-south-1.compute.amazonaws.com';

  const dbConfig = {
    host: '15.185.96.45',
    port: '3306',
    user: 'omercan',
    password: '1234',
    database: 'HITS'
  };

  const connection = mysql.createPool(dbConfig);

  connection.getConnection((error) => console.log(error));

  const app = express();

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  const myInstance = new MySQLEvents(connection, {
    startAtEnd: true
  });

  await myInstance.start()
    .then(() => console.log('I\'m running!'))
    .catch(err => console.error('Something bad happened', err));

  channel.on('connection', (socket) => {
    console.log('connected for socketio');
  });

  myInstance.addTrigger({
    name: 'EMPLOYEE_PATIENT_TRIGGER',
    expression: 'HITS.employee_patient',
    statement: MySQLEvents.STATEMENTS.INSERT,
    onEvent: (event) => {
      let updatedData = [];
      event.affectedRows.map((data) => {
        updatedData = [...updatedData, { updatedEmployeeId: data.after.employee_id, updatedPatientId: data.after.patient_id, after: true }];
      });
      channel.emit('employee_patient_insert', { updatedData });
    }
  });

  myInstance.addTrigger({
    name: 'EMPLOYEE_PATIENT_TRIGGER',
    expression: 'HITS.employee_patient',
    statement: MySQLEvents.STATEMENTS.DELETE,
    onEvent: (event) => {
      let updatedData = [];
      event.affectedRows.map((data) => {
        updatedData = [...updatedData, { updatedEmployeeId: data.before.employee_id, updatedPatientId: data.before.patient_id, before: true }];
      });
      channel.emit('employee_patient_delete', { updatedData });
    }
  });

  myInstance.addTrigger({
    name: 'EMPLOYEE_STATUS_TRIGGER',
    expression: 'HITS.employee_status',
    statement: MySQLEvents.STATEMENTS.UPDATE,
    onEvent: (event) => {
      let updatedEmployeeId = '';
      event.affectedRows.map((data) => {
        updatedEmployeeId = data.after.employee_id;
      });
      channel.emit('employee_status', { updatedEmployeeId });
    }
  });

  myInstance.addTrigger({
    name: 'EMPLOYEES_TRIGGER',
    expression: 'HITS.employees',
    statement: MySQLEvents.STATEMENTS.UPDATE,
    onEvent: (event) => {
      let updatedEmployeeId = '';
      event.affectedRows.map((data) => {
        updatedEmployeeId = data.after.employee_id;
      });
      channel.emit('employees', { updatedEmployeeId });
    }
  });

  myInstance.addTrigger({
    name: 'PATIENTS_TRIGGER',
    expression: 'HITS.patients',
    statement: MySQLEvents.STATEMENTS.INSERT || MySQLEvents.STATEMENTS.DELETE,
    onEvent: () => {
      channel.emit('patients', null);
    }
  });

  myInstance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  myInstance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello' });
  });

  app.get('/get-xmpp-sw', (req, res) => {
    return res.send({ error: true, message: xmppSw });
  });

  app.post('/employeeForLogin/', async (req, res) => {
    let retUser = {};
    let retData = [];
    console.log('Connected!');
    const data = { username: req.body.username, password: req.body.password };
    const sql1 = `SELECT * FROM employees WHERE employee_username="${data.username}"`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else {
        results.map((user) => {
          if (bcrypt.compareSync(data.password, user.employee_password)) {
            retUser = { employee_id: user.employee_id,
                        employee_personel_no: user.employee_personel_no,
                        employee_firstname: user.employee_firstname,
                        employee_lastname: user.employee_lastname,
                        employee_username: user.employee_username,
                        employee_password: user.employee_password,
                        valid: true };
            retData.push(retUser);
          }
        });
        res.send(retData);
      }
    });
  });

  app.post('/leaveChannel/', async (req, res) => {
    console.log('Connected!');
    const data = { employeeId: req.body.employeeId, patientId: req.body.patientId };
    const sql1 = `DELETE FROM employee_patient WHERE employee_id = ${data.employeeId} and patient_id = ${data.patientId};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/checkPassword/', async (req, res) => {
    let retUser = {};
    console.log('Connected!');
    const data = { username: req.body.username, password: req.body.password };
    const sql1 = `SELECT * FROM employees WHERE employee_username="${data.username}";`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else {
        results.map((user) => {
          if (bcrypt.compareSync(data.password, user.employee_password)) {
            retUser = { valid: true };
          } else {
            retUser = { valid: false };
          }
        });
        res.send(retUser);
      }
    });
  });

  app.post('/setPatients/', async (req, res) => {
    console.log('Connected!');
    const sql1 = 'SELECT * from patients;';
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });


  app.post('/setPatientsSearchValue/', async (req, res) => {
    console.log('Connected!');
    const { id, searchValue } = { id: req.body.id, searchValue: req.body.searchValue };
    const sql1 = `SELECT * from patients WHERE
    patient_firstname LIKE '%${searchValue}%' OR patient_lastname LIKE '%${searchValue}%'
    ORDER BY patient_firstname;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setEmployees/', async (req, res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 = `SELECT * from employees, employee_status, employee_department, departments, roles, employee_role, status WHERE
    employees.employee_id <> ${id} AND
    employees.employee_id = employee_status.employee_id AND
    employees.employee_id = employee_role.employee_id and
    roles.role_id = employee_role.role_id and
    employees.employee_id = employee_department.employee_id AND
    departments.department_id = employee_department.department_id AND
    status.status_id = employee_status.status_id
    ORDER BY employee_status.status_id, employees.employee_firstname;`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });
  //employees.employee_id <> ${id} AND
  app.post('/getRelevantEmployeesInfo/', async (req, res) => {
    console.log('Connected!');
    const { id, id2 } = { id: req.body.id, id2: req.body.id2 };
    const sql1 = `SELECT * from employees, employee_patient, employee_status, employee_department, departments, roles, employee_role, status WHERE
    employees.employee_id = employee_status.employee_id AND
    employees.employee_id = employee_role.employee_id and
    roles.role_id = employee_role.role_id and
    employees.employee_id = employee_department.employee_id AND
    departments.department_id = employee_department.department_id AND
    employees.employee_id = employee_patient.employee_id AND
    employee_patient.employee_id = employee_status.employee_id AND
    employee_patient.patient_id = ${id2} AND
    status.status_id = employee_status.status_id
    ORDER BY employee_status.status_id, employees.employee_firstname;`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setEmployeesDepartmentId/', async (req, res) => {
    console.log('Connected!');
    const { id, departmentId } = { id: req.body.id, departmentId: req.body.departmentId };
    const sql1 = `SELECT * from employees, employee_status, employee_department, departments, roles, employee_role WHERE
    employees.employee_id <> ${id} and
    employee_department.department_id = ${departmentId} and
    employees.employee_id = employee_role.employee_id and
    roles.role_id = employee_role.role_id and
    employees.employee_id = employee_department.employee_id and
    employees.employee_id = employee_status.employee_id AND
    departments.department_id = employee_department.department_id
    ORDER BY employee_status.status_id, employees.employee_firstname;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setEmployeesSearchValue/', async (req, res) => {
    console.log('Connected!');
    const { id, searchValue } = { id: req.body.id, searchValue: req.body.searchValue };
    const sql1 = `SELECT * from employees, employee_status, employee_department, departments, roles, employee_role WHERE
    employees.employee_id <> ${id} AND
    employees.employee_id = employee_department.employee_id and
    employees.employee_id = employee_role.employee_id and
    roles.role_id = employee_role.role_id and
    departments.department_id = employee_department.department_id and
    employees.employee_id = employee_status.employee_id AND
    (employees.employee_firstname LIKE '%${searchValue}%' OR employees.employee_lastname LIKE '%${searchValue}%')
    ORDER BY employee_status.status_id, employees.employee_firstname, employees.employee_lastname;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setEmployeesSearchValueDepartmentId/', async (req, res) => {
    console.log('Connected!');
    const { id, searchValue, departmentId } = { id: req.body.id, searchValue: req.body.searchValue, departmentId: req.body.departmentId };
    const sql1 = `SELECT * from employees, employee_status, employee_department, departments, roles, employee_role WHERE
    employees.employee_id <> ${id} AND
    employee_status.employee_id <> ${id} AND
    employees.employee_id = employee_status.employee_id AND
    employees.employee_id = employee_role.employee_id and
    roles.role_id = employee_role.role_id and
    employee_department.employee_id <> ${id} AND
    employee_department.department_id = ${departmentId} AND
    employees.employee_id = employee_department.employee_id and
    departments.department_id = ${departmentId} and
    (employees.employee_firstname LIKE '%${searchValue}%' OR
    employees.employee_lastname LIKE '%${searchValue}%')
    ORDER BY employee_status.status_id, employees.employee_firstname;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setDepartments', async (req, res) => {
    console.log('Connected!');
    const sql1 = 'SELECT * from departments;'
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/getRelevantPatientInfo/', async (req, res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 = `SELECT * FROM patients WHERE patient_id IN (SELECT patient_id FROM employee_patient WHERE employee_id = ${id})`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/setPatientInfo/', async (req, res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 = `SELECT * FROM patients WHERE patient_id = ${id}`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/addEmployeeToPatientChannel/', async (req, res) => {
    console.log('Connected!');
    const data = { patient_id: req.body.patient_id, employee_id: req.body.employee_id };
    console.log(data);
    res.send(data);
    const sql1 = 'INSERT INTO employee_patient SET ?';
    await connection.query(sql1, data, (error, results) => {
      if (error) console.log(error);
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/getEmployeeInfo/', async (req, res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 =
    `SELECT * FROM employees, employee_status, status WHERE
    employees.employee_id = ${id} and
    employees.employee_id = employee_status.employee_id and
    employee_status.status_id = status.status_id;`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/getEmployeeStatusName/', async (req, res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 = `SELECT status.status_name FROM employees, status, employee_status WHERE employees.employee_id = ${id} AND employee_status.employee_id = ${id} AND employee_status.status_id = status.status_id`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/getEmployeeRoleName/', async (req,res) => {
    console.log('Connected!');
    const id = req.body.id;
    const sql1 = `SELECT roles.role_name FROM employees, roles, employee_role WHERE employees.employee_id = employee_role.employee_id AND employees.employee_id = ${id} AND employee_role.role_id = roles.role_id`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.put('/setEmployeeInfoForStatus/', async (req, res) => {
    console.log('Connected!');
    const data = { employee_status: req.body.new_status, employee_id: req.body.employee_id };
    res.send(data);
    const sql1 = `UPDATE employee_status SET employee_status.status_id = ${data.employee_status} WHERE employee_status.employee_id = ${data.employee_id}`;
    await connection.query(sql1, data, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/getStatusTable/', async (req, res) => {
    const sql1 = 'SELECT * from status;';
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/checkPermissionForRemove/', async (req, res) => {
    const ownId = req.body.ownId;
    const sql1 = `SELECT * from employee_role WHERE
                  employee_role.employee_id = ${ownId} and
                  employee_role.role_id = 1;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.post('/removeFromChannel/', async (req, res) => {
    const { touchedEmployeeId, clickedPatientId } = { touchedEmployeeId: req.body.touchedEmployeeId, clickedPatientId: req.body.clickedPatientId };
    const sql1 = `DELETE FROM employee_patient WHERE
                  employee_patient.employee_id = ${touchedEmployeeId} AND
                  employee_patient.patient_id = ${clickedPatientId}
                  ;`
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.send(results);
    });
  });

  app.put('/changeEmployeePassword/', async (req, res) => {
    console.log('ÇALİŞTUUU');
    console.log('Connected!');
    const data = {
      employee_id: req.body.employeeId,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    };
    res.send(data);
    const hash = bcrypt.hashSync(data.newPassword, 10);
    const sql1 = `UPDATE employees SET employee_password = "${hash}" WHERE employee_id = ${data.employee_id}`;
    await connection.query(sql1, data, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/getEmployeePermissions/', async (req, res) => {
    const employeeId = req.body.employeeId;
    const sql1 = `SELECT permissions.show_patients, permissions.wifi_outside FROM employee_permission, permissions
                  WHERE employee_permission.employee_id = ${employeeId} and
                  employee_permission.permission_id = permissions.permission_id`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/isEmployeeSubscribe/', async (req, res) => {
    const data = {
      employee_id: req.body.employeeId,
      patient_id: req.body.patientId
    };
    const sql1 = `SELECT * from employee_patient WHERE
                  employee_patient.patient_id = ${data.patient_id} AND
                  employee_patient.employee_id = ${data.employee_id};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/subscribeEmployee/', async (req, res) => {
    const data = {
      employee_id: req.body.employeeId,
      patient_id: req.body.patientId
    };
    const sql1 = `INSERT INTO employee_patient(employee_id, patient_id)
                  VALUES(${data.employee_id}, ${data.patient_id});`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/getPatientInfo/', async (req, res) => {
    const patient_id = req.body.patient_id;
    console.log('---------------patient_id', patient_id);
    const sql1 = `SELECT * FROM patients WHERE patient_id = ${patient_id};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/get-employee-dep-role/', async (req, res) => {
    const employee_id = req.body.employee_id;
    const sql1 = `SELECT employee_department.department_id, employee_role.role_id FROM employees, employee_department, employee_role WHERE
                  employees.employee_id = ${employee_id} AND
                  employee_department.employee_id = ${employee_id} AND
                  employee_role.employee_id = ${employee_id};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.get('/get-deps/', async (req, res) => {
    const sql1 = 'SELECT department_id, department_name FROM departments;'
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.get('/get-roles/', async (req, res) => {
    const sql1 = 'SELECT role_id, role_name FROM roles;'
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/is-user-mod/', async (req, res) => {
    const data = {
      employee_id: req.body.employeeId,
      patient_id: req.body.patientId
    };
    const sql1 = `SELECT * from employee_patient_mod WHERE
                  employee_id = ${data.employee_id} AND
                  patient_id = ${data.patient_id};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/set-user-mod/', async (req, res) => {
    const data = {
      employee_id: req.body.employeeId,
      patient_id: req.body.patientId
    };
    const sql1 = `INSERT INTO employee_patient_mod(employee_id, patient_id)
                  VALUES(${data.employee_id}, ${data.patient_id});`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  app.post('/remove-user-mod/', async (req, res) => {
    const data = {
      employee_id: req.body.employeeId,
      patient_id: req.body.patientId
    };
    const sql1 = `DELETE FROM employee_patient_mod WHERE
                  employee_id = ${data.employee_id} AND
                  patient_id =  ${data.patient_id};`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else res.end(JSON.stringify(results));
    });
  });

  /*
  SELECT * FROM employee_patient WHERE
                employee_id = 1 and
                patient_id IN ( SELECT patient_id FROM patients WHERE
                  LOWER(patient_firstname) LIKE '%ege%' AND
                  LOWER(patient_lastname) LIKE '%tuna%');
  */

  //myInstance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  //myInstance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  appServer.listen(port, () => {
    console.log('app2 OK');
  })

  app.listen(3000, () => {
   console.log('You can see the data.');
  });
}

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);



/*
connection.connect((err) => {
if (!err) {
     console.log('Database is connected ... ');
} else {
    console.log('Error connecting database ... ');
}
});
*/

/*
app.get('/chatroom_employees/:id', (req, res) => {
    connection.getConnection((error) => {
      console.log('Connected!');
      const { id } = req.params;
      const sql1 = `SELECT * FROM chatroom_employees WHERE employee_id = ${id}`;
      connection.query(sql1, (error, results) => {
        if (error) throw error;
        else res.send(results);
      });
  });
});
*/
/*
app.get('/patients/:id', (req, res) => {
    connection.getConnection((error) => {
      console.log('Connected!');
      const { id } = req.params;
      const sql1 = `SELECT * FROM patients WHERE patient_id = ${id}`;
      connection.query(sql1, (error, results) => {
        if (error) throw error;
        else res.send(results);
      });
  });
});
*/
