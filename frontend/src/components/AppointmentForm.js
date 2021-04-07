import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DateTimePickers from './datepicker.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from './Alerts.js';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    width: 'min-content',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AppointmentForm(props) {

  const classes = useStyles();

  const [hospital, setHospital] = React.useState([{'initial':'here'}]);

  React.useEffect(() => {
      if (props.userType == 1){

          fetch(process.env.REACT_APP_SERVER_URL+"hospitalList/", {
                method: 'GET', // or 'PUT'
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token '+ localStorage.getItem('secret'),
                },
              })
              .then(response => {
                  if (response.status == 200){
                      response.json().then(data => {
                          setHospital(data['hospitals'])
                          setHospital((data) => {
                              console.log(data);
                              return data;
                          });
                      })
                  }else{ //if(response.status == 400)
                      console.log("bad token")
                  }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
      }
 },[props.loggedIn]);



 var date = new Date();
 date.setDate(date.getDate() + 1)
 date.setMinutes(0)

 const [inputDate, setInputDate] = useState(date.toLocaleDateString())
 const [inputTime, setInputTime] = useState(1)
 const [inputHospital, setInputHospital] = useState("")


    const [availableTime, setAvailableTime] = useState([])

    function refreshTimes(event){
        var data = {
            'date':inputDate,
            'hosp':inputHospital,
        }
        console.log("data",data);

        fetch(process.env.REACT_APP_SERVER_URL+"availableTime/", {
              method: 'POST', // or 'PUT'
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ localStorage.getItem('secret'),
              },
              body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status == 200){
                    response.json().then(data => {
                        setAvailableTime(data['times'])
                        setAvailableTime((data) => {
                            return data;
                        });
                    })
                }else{ //if(response.status == 400)
                    console.log("bad token")
                }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
    };

    function handleHospitalChange(event){
        setInputHospital((data) => {
            return event.target.value;
        });
    };
    function handleDateChange(date){
        setInputDate(date.toLocaleDateString());
        setInputDate((data) => {
            return data;
        });
    };
    function handleTimeChange(event){
        setInputTime(event.target.value);
    };

    React.useEffect(() => {
        refreshTimes();
    },[inputHospital,inputDate])

    const [refreshAlert, callRefreshAlert] = useState("Choose Details|info")

    function postAppointment(event){
        var data = {
            'date':inputDate,
            'hosp':inputHospital,
            'time':inputTime,
        }
        fetch(process.env.REACT_APP_SERVER_URL+"ReqAppointment/", {
              method: 'POST', // or 'PUT'
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ localStorage.getItem('secret'),
              },
              body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status == 200){
                    response.json().then(data => {
                        if(data.status){
                            callRefreshAlert(("Successfully Posted!|success"))
                            refreshTimes();
                        }else{
                            callRefreshAlert((data.error+'|error'))
                        }
                    })
                }else{ //if(response.status == 400)
                    console.log("bad token")
                }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
    };



  const bull = <span className={classes.bullet}>•</span>;
  return (
      <Grid
   container
   spacing={0}
   direction="column"
   alignItems="center"
   justify="center"
   style={{ minHeight: '100vh' }}
  >

   <Grid item xs={3}>
    <Card className={classes.root}>
      <CardContent justify="center">
          <Typography component="h5" variant="h5">
              Appointment Form
          </Typography>
      <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="hospitalSelect-label">Hospital</InputLabel>
          <Select
            labelId="hospitalSelect-label"
            id="hospitalSelect"
            value={inputHospital}
            onChange={handleHospitalChange}
            label="hospital"
            >
            {
               hospital.map((object,i) => <MenuItem key={i} value={object.id}>{object.name}</MenuItem>)
            }
          </Select>
        </FormControl>
        <DateTimePickers handleDateChange={handleDateChange} inputTime={inputTime} inputDate={inputDate} />
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="TimeSelect-label">Time</InputLabel>
            <Select
              labelId="TimeSelect-label"
              id="TimeSelect"
              label="Time"
              value={inputTime}
              onChange={handleTimeChange}
              >
              {
                 availableTime.map((object,i) => <MenuItem key={i} value={object}>{object}</MenuItem>)
              }
            </Select>
          </FormControl>
          <Button
            type="Button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={postAppointment}
          >
            Request
          </Button>
          <Alert alert={refreshAlert}/>
      </CardContent>
    </Card>
    </Grid>
    </Grid>
  );
}
