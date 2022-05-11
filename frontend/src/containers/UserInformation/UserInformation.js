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
import { get_university_by_params } from '../../actions/university.js';
import { get_curriculums_by_params } from '../../actions/curriculums.js';
import Paper from '@mui/material/Paper';
import { FormControl, TextField, Button, InputLabel, NativeSelect } from '@mui/material';
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

const rows = (student, setStudent, studentCopy, setStudentCopy, utils) => {
  let universities = utils.universities;
  let curriculums_by_universities = utils.curriculums
  let student_curriculum = studentCopy.curriculums[0].curriculum_name;

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

    if (name == "selected_university") { 
        utils.fetchUniversityCurriculums(value);
     }
     
    setStudentCopy({ ...studentCopy, [name]: value });
  };

  const updateStudent = (success_message, error_message, student) => {
    update_student_by_id(student.user_id, student).then(
      response => {
        setStudentCopy(response.data);
        setStudent(response.data);
        alert(success_message);
      }
    ).catch((error) => {
      alert(error_message);
    });
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
      <Button onClick={() => updateStudent(
        "Name has been succesfully updated!",
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
          disabled={true}
          type="email"
          size="small"
          placeholder="Enter your email" />
      </FormControl>,
    ],
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
        onClick={() => updateStudent(
          "Year of admission has been succesfully updated!",
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
        onClick={() => updateStudent(
          "Password has been succesfully updated!",
          "Unable update your password.\n\nMake sure it has at least 8 characters and that it contains at least 1 capitalized letter, 1 uncapitalized letter and 1 number."
          ,
          {
            user_id: studentCopy.user_id,
            password: studentCopy.password,
          })}
        align='center' variant="contained">Update</Button>
    ]),
    createData('Curriculum', student_curriculum, [
      <div>
        <Typography variant="h6">{"Enrolled curriculum:"}</Typography>
        <Typography  style={{fontWeight: 400}}>{student_curriculum}</Typography>
      </div>
      ,
      <Typography variant="h6">Update your curriculum?</Typography>
      ,
      <FormControl>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">University</InputLabel>
        <NativeSelect
          defaultValue={null}
          name="selected_university"
          onChange={inputChange}
          style={{width: 300}}
        >
          <option value={null}>Select university...</option>
          {Array.from(universities, (current) => <option value={current.university_id}>{current.university_name}</option>)}
        </NativeSelect>
      </FormControl>,

      <FormControl>
        {curriculums_by_universities && curriculums_by_universities.length != 0 && <div>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">Curriculum</InputLabel>
          <NativeSelect
            defaultValue={null}
            name="selected_curriculum"
            onChange={inputChange}
            style={{width: 300}}
          >
            <option value={null}>Select curriculum...</option>
            {Array.from(curriculums_by_universities, (current) => <option value={current.curriculum_id}>{current.curriculum_name}</option>)}
          </NativeSelect>
        </div>}
      </FormControl>,
            <Button
            disabled = {!studentCopy["selected_curriculum"]} 
            onClick={() => 
            updateStudent(
                "Curriculum has been succesfully updated!",
                "Unable to update curriculum",
            {
              user_id: studentCopy.user_id,
              curriculums: [studentCopy["selected_curriculum"]]
            })}
            align='center'
            variant="contained">Update Curriculum</Button>
    ]),
  ]
};

export default function UserInformation() {
  let navigate = useNavigate();
  const [student, setStudent] = React.useState();
  const [studentCopy, setStudentCopy] = React.useState();
  const [universities, setUniversities] = React.useState();
  const [availableCurriculums, setAvailableCurriculums] = React.useState();

  React.useEffect(() => {
    get_student_by_id(localStorage.getItem("user_id")).then(
      response => {
        setStudentCopy({ ...response.data, selected_university: null });
        setStudent(response.data);
      }
    ).catch((error) => {
      console.log(error.response.data);
      localStorage.removeItem("user_id");
      navigate("/");
    });


  }, []);

  React.useEffect(() => {
    if (student) {
      let email = student.institutional_email
      let domain = email.substring(email.indexOf('@') + 1, email.length);
      get_university_by_params({'institutional_domain': domain}).then(
        response => {
          setUniversities(response.data);
        }
      )
    }
  }, [student]);

  const fetchUniversityCurriculums = (university_id) => {
    get_curriculums_by_params(university_id).then(
      response => {
        setAvailableCurriculums(response.data);
      }
    ).catch((error) => {
        setAvailableCurriculums(null);
    });;
  }

  return (
    <Box sx={{ mx: 6, my: 6 }}>

      {student && universities ?
        <div>
          <Typography align="center" sx={{ marginBottom: 2.5 }} variant="h5">Profile</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableBody>
                {rows(student, setStudent, studentCopy, setStudentCopy, 
                { universities, 
                  curriculums: availableCurriculums, 
                  fetchUniversityCurriculums }).map((row) => (
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