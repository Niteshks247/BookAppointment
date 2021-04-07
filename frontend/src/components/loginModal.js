import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignIn from './SignIn.js'


export default function FormDialog(props) {
  const [open, setOpen] = React.useState(!props.loggedIn);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
      if (!props.loggedIn){
          handleClickOpen()
      }else{
          handleClose()
      }
  return () => {};
  },[props.loggedIn]);

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <SignIn handleClose={handleClose} setLogged={props.setLogged} setUserType={props.setUserType}/>
      </Dialog>
    </div>
  );
}
