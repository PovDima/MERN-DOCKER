import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper, Typography, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { attemptLogin } from "../../store/thunks/auth";

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
    alignItems: 'center'
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
  fieldsWrapper: {
    width: '100%',
    marginBottom: '20px'
  },
  link: {
    color: '#000'
  }
}))

const Login = () => {
  const classes = useStyles()
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.user);
  const [state, setState] = useState({ username: "", password: "", })
  const [serverError, setServerError] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(50).required("Required"),
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const handleSubmit = () => {
    validationSchema.validate(state).then((data) => {
      dispatch(attemptLogin(data)).catch((error) => {
        if (error.response) {
          setServerError(error.response.data.message);
        }
      });
    }).catch(err => {
      setServerError(err.message)
    })
  };

  const handleChange = (key) => (e) => {
    setState({ ...state, [key]: e.target.value })
  }

  return isAuth ? (
    <Redirect to='/entrants' />
  ) : (
    <div className={classes.wrapper}>
      <Paper className={classes.paperWrapper}>
        <div className={classes.fieldsWrapper}>
          <div className={classes.fieldWrapper}>
            <Typography  >Username</Typography>
            <TextField variant={'outlined'} value={state.username} onChange={handleChange('username')} />
          </div>
          <div className={classes.fieldWrapper}>
            <Typography>Password</Typography>
            <TextField type={'password'} variant={'outlined'} value={state.password} onChange={handleChange('password')} />
          </div></div>
        <Link className={classes.link} to='/login/forgot'>Forgot your password?</Link>
        <div className={classes.buttonsWrapper}>
          <Button onClick={handleSubmit}>
            Login
          </Button>
          <Link className={classes.link} to='/register'>Sign Up</Link>
        </div>
        {serverError}
      </Paper>
    </div>
  )
}

export default Login
