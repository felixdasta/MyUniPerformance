import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { get_student_by_id, update_student_by_id } from '../../actions/user.js';
import Paper from '@mui/material/Paper';
import { FormControl, TextField, Select, MenuItem, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import * as Loader from "react-loader-spinner";
import './UserInformation.scss'

function createData(name, type, data) {
  return {
    name,
    type,
    data
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow className="setting" sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        <TableCell>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{!open && row.type}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableBody>
                  {row.data.map((currentRow) => (
                    <TableRow>
                      <TableCell component="th" scope="row" align="center" style={{ borderBottom: 0 }}>
                        {currentRow}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = (student, setStudent, studentCopy, setStudentCopy, navigate) => {
  let curriculums = "";

  const inputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name == "year_of_admission") {
      try {
        value = parseInt(value);
        if (value < 2016 || value > 2022) {
          value = student.year_of_admission;
        }
      } catch (error) {
        value = student.year_of_admission;
      }
    }

    setStudentCopy({ ...studentCopy, [name]: value });
  };

  const updateStudent = (success_message, error_message, student) => {
    update_student_by_id(student.user_id, student).then(
      response => {
        setStudentCopy(response.data);
        setStudent(response.data);
        alert(success_message);

        if(student['institutional_email']){
          localStorage.removeItem("user_id");
          navigate("/");
        }
      }
    ).catch((error) => {
      alert(error_message);
    });
  }

  for (let i = 0; i < student.curriculums.length; i++) {
    let curriculum = student.curriculums[i];
    curriculums += curriculum.curriculum_name;
    curriculums += i + 1 < student.curriculums.length ? ", " : "";
  }

  return [
    createData('Name', student.first_name + " " + student.last_name, [
      <FormControl>
        <TextField
          label="First name"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={studentCopy.first_name}
          name="first_name"
          onChange={inputChange}
          size="small"
          placeholder="Enter your first name" />
      </FormControl>,

      <FormControl>
        <TextField
          label="Last name"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={studentCopy.last_name}
          name="last_name"
          onChange={inputChange}
          size="small"
          placeholder="Enter your last name" />
      </FormControl>,
      <Button onClick={() => updateStudent("Name has been succesfully updated!",
        "Unable to change your name",
        {
          user_id: studentCopy.user_id,
          first_name: studentCopy.first_name,
          last_name: studentCopy.last_name
        })}
        align='center'
        variant="contained">Update</Button>]),

    createData('Email', student.institutional_email, [
      <FormControl>
        <TextField
          label="Email"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={studentCopy.institutional_email}
          name="institutional_email"
          onChange={inputChange}
          type="email"
          size="small"
          placeholder="Enter your email" />
      </FormControl>,
      <Button onClick={() => {
        updateStudent(
          "Email changed! Please verify it in order to use the account...",
          "ERROR: It's possible that the email address is invalid or that a user has already registered with that address. \n\nAlways use institutional email.", {
          user_id: studentCopy.user_id,
          institutional_email: studentCopy.institutional_email
        });
      }}
        align='center' variant="contained">Update</Button>
    ],
      <Button align='center' variant="contained">Update</Button>
    ),
    createData('Year of admission', student.year_of_admission, [
      <FormControl>
        <TextField
          label="Year of admission"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={studentCopy.year_of_admission}
          name="year_of_admission"
          onChange={inputChange}
          type="number"
          inputProps={{ min: 2016, max: 2022 }}
          size="small"
          placeholder="Enter year of admission" />
      </FormControl>,
      <Button 
      onClick={() => updateStudent("Year of admission has been succesfully updated!",
        "Unable to change your year of admission.",
        {
          user_id: studentCopy.user_id,
          year_of_admission: studentCopy.year_of_admission,
        })}
      align='center' variant="contained">Update</Button>]),
    createData('Password', "● ● ● ● ● ● ● ●", [
      <FormControl>
        <TextField
          label="New password"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          type="password"
          name="password"
          onChange={inputChange}
          size="small"
          placeholder="Enter your new password" />
      </FormControl>,
      <Button 
      onClick={() => updateStudent("Password has been succesfully updated!",
      "Unable update your password.\n\nMake sure it has at least 8 characters and that it contains at least 1 capitalized letter, 1 uncapitalized letter and 1 number."
      ,
      {
        user_id: studentCopy.user_id,
        password: studentCopy.password,
      })}
      align='center' variant="contained">Update</Button>
    ]),
    createData('Curriculums', curriculums, [

    ]),
  ]
};

export default function UserInformation() {
  let navigate = useNavigate();
  const [student, setStudent] = React.useState();
  const [studentCopy, setStudentCopy] = React.useState();

  React.useEffect(() => {
    get_student_by_id(localStorage.getItem("user_id")).then(
      response => {
        setStudentCopy(response.data);
        setStudent(response.data);
      }
    ).catch((error) => {
      console.log(error.response.data)
      localStorage.removeItem("user_id");
      navigate("/");
    })
  }, []);


  return (
    <Box sx={{ mx: 6, my: 6 }}>

      {student ?
        <div>
          <Typography align="center" sx={{ marginBottom: 2.5 }} variant="h5">Profile</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableBody>
                {rows(student, setStudent, studentCopy, setStudentCopy, navigate).map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div> :
        <div className="loader"><Loader.ThreeDots color="black" height={120} width={120} /></div>}
    </Box>
  );
}