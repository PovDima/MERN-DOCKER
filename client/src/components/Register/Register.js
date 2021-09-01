import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper, Typography, TextField } from "@material-ui/core";
import * as Yup from "yup";
import {
  attemptRegister,
  attemptResendConfirmation,
  attemptResetRegister,
} from "../../store/thunks/auth";

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px'
  },
  paperWrapper: {
    padding: '35px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  fieldWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 0'
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  fieldTitle: {
    marginRight: '15px'
  },
  message: {
    textAlign: 'center'
  }
}))

const Register = () => {
  const classes = useStyles()
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.user);
  const [serverError, setServerError] = useState("");
  const [email, setEmail] = useState("");
  const [registerStep, setRegisterStep] = useState("register");
  const [state, setState] = useState({
    email: "",
    username: "",
    password: "",
  })


  const validationSchema = Yup.object({
    email: Yup.string().min(5).max(255).email().required("Required"),
    username: Yup.string().min(3).max(50).required("Required"),
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const handleChange = key => e => {
    setState({ ...state, [key]: e.target.value })
  }

  const handleSubmit = () => {
    validationSchema.validate(state).then((data) => {
      dispatch(attemptRegister(state))
        .then(() => {
          setEmail(state.email);
          setRegisterStep("resend");
        })
        .catch((error) => {
          if (error.response) {
            setServerError(error.response.data.message);
          }
        });
    }).catch(err => {
      setServerError(err.message)
    })

  };

  const handleResendEmail = () => {
    dispatch(attemptResendConfirmation(email))
      .then(() => setRegisterStep("reset"))
      .catch((error) => {
        if (error.response) {
          setServerError(error.response.data.message);
        }
      });
  };

  const handleReset = () => {
    dispatch(attemptResetRegister(email)).catch((error) => {
      if (error.response) {
        setServerError(error.response.data.message);
      }
    });
  };

  const renderSwitch = () => {
    switch (registerStep) {
      case "register":
        return (
          <>
            <div className={classes.fieldWrapper}>
              <Typography className={classes.fieldTitle}>Email</Typography>
              <TextField variant={'outlined'} value={state.email} onChange={handleChange('email')} />
            </div>
            <div className={classes.fieldWrapper}>
              <Typography className={classes.fieldTitle}>Username</Typography>
              <TextField variant={'outlined'} value={state.username} onChange={handleChange('username')} />
            </div>
            <div className={classes.fieldWrapper}>
              <Typography className={classes.fieldTitle}>Password</Typography>
              <TextField type={'password'} variant={'outlined'} value={state.password} onChange={handleChange('password')} />
            </div>
            <Button onClick={handleSubmit} >
              Signup
            </Button>
            {serverError}
          </>
        );
      case "resend":
        return (
          <>
            <Typography>A verification email has been sent. Check you mailbox : {email}</Typography>
            <Typography>You have 12 hours to activate your account. It can take up to 15 min to receive your email</Typography>
            <Button onClick={handleResendEmail}>Did not receive the email? Click here to send again</Button>
            {serverError}
          </>
        );

      case "reset":
        return (
          <>
            <Typography>Still not received an email? </Typography>
            <Typography>Try to register again. You may have given the wrong email. </Typography>
            <Typography>If you want to be able to use the same username, reset the registration</Typography>
            <Button onClick={handleReset}>Click here to reset the registration</Button>
            {serverError}
          </>
        );
      default:
        break;
    }
  }

  return isAuth ? <Redirect to='/entrants' /> :
    <div className={classes.wrapper}>
      <Paper className={classes.paperWrapper}>
        {renderSwitch()}
      </Paper>
    </div >
}

export default Register
