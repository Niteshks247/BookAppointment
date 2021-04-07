import React, { useState,useEffect } from 'react';
import './App.css'
import FormDialog from './components/loginModal.js'
import AppointmentForm from './components/AppointmentForm.js'
import ListAppointments from './components/ListAppointments.js'

function App() {

    const [loggedIn, setLogged] = useState(false)
    const [userType, setUserType] = useState(0)

    fetch(process.env.REACT_APP_SERVER_URL+"checkToken/", {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ localStorage.getItem('secret'),
          },
        })
        .then(response => {
            if (response.status == 200){
                response.json().then(data => {
                    if(data.status){
                        setUserType(data.type);
                        setLogged(true);
                    }
                })
            }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    function AfterLogin(props){
        if(props.loggedIn && props.userType==1){
            return <AppointmentForm loggedIn={loggedIn} userType={userType}/>;
        }else if(props.loggedIn && props.userType==2){
            return <ListAppointments loggedIn={loggedIn} userType={userType}/>;
        }else{
            return <FormDialog loggedIn={loggedIn} userType={userType} setLogged={setLogged} setUserType={setUserType} />;
        }
    }

  return (
    <div>
        <AfterLogin loggedIn={loggedIn} userType={userType} />
    </div>
  );
}

export default App;
