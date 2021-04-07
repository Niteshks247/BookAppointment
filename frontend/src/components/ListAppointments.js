import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DateTimePickers from './datepicker.js';
import DataTable from './datatable.js'
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
      width: 'min-content',
    },
}));

export default function ListAppointments(props) {
    const classes = useStyles();

    var date = new Date();
    date.setDate(date.getDate() + 1)
    date.setMinutes(0)

    const [appointmentDate, setAppointmentDate] = React.useState(date.toLocaleDateString());
    const [appointmentList, setAppointmentList] = React.useState([{"id":0,"Choose Date":1,"To display Appointments":2},]);

    function handleDateChange(date){
        setAppointmentDate(date.toLocaleDateString());
    }

    React.useEffect(() => {
        if (props.userType == 2){
            var data = {
                'date':appointmentDate,
            }
            fetch(process.env.REACT_APP_SERVER_URL+"checkAppointments/", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token '+ localStorage.getItem('secret'),
                  },
                  body: JSON.stringify(data)
                })
                .then(response => {
                    if (response.status == 200){
                        response.json().then(data => {
                            console.log(data);
                        })
                    }else{ //if(response.status == 400)
                        console.log("bad token")
                    }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
        }
   },[appointmentDate]);

   function getColumns(rows){
       var row = Object.keys(rows[0]);
       console.log(row);
       return row.map((data)=>{return {"field":data,
                                "headerName":data,
                                "width":300,
                               }
                       }
              )
   }

    return (
        <Grid
     container
     direction="column"
     alignItems="center"
     justify="center"
     style={{ minHeight: '100vh' }}
    >
    <DateTimePickers handleDateChange={handleDateChange} inputDate={appointmentDate} />
    <DataTable rows={appointmentList} columns={getColumns(appointmentList)} />
    </Grid>
  );
}
