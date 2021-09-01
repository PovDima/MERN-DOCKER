import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper, Typography, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { attemptSendResetPasswordLink } from "../../store/thunks/auth";

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px'
  },
  paperWrapper: {
    padding: '35px',
    width: '450px',
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
  fieldTitle: {
    marginRight: '15px'
  },
  message: {
    textAlign: 'center'
  }
}))

const LoginForgot = () => {
  const classes = useStyles()
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.user);
  const [serverError, setServerError] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [email, setEmail] = useState('')

  const validationSchema = Yup.object({
    email: Yup.string().min(5).max(255).email().required("Required"),
  });

  const handleSubmit = () => {
    validationSchema.validate({ email }).then((data) => {
      dispatch(attemptSendResetPasswordLink(email))
        .then(() => setIsSubmited(true))
        .catch((error) => {
          if (error.response) {
            setServerError(error.response.data.message);
          }
        });
    }).catch(err => {
      console.log(err)
    })

  };

  return isAuth ? (
    <Redirect to='/entrants' />
  ) : isSubmited ? (
    <div className={classes.wrapper}>
      <Paper className={classes.paperWrapper}>
        <Typography className={classes.message}>
          A reset link has been sent to your email. <b>You have 12 hours to activate your account.</b>
          It can take up to 15 min to receive our email.
        </Typography>
      </Paper>
    </div >
  ) : (
    <div className={classes.wrapper}>
      <Paper className={classes.paperWrapper}>
        <Typography>We will send you a reset link on the following email :</Typography>
        <div className={classes.fieldWrapper}>
          <Typography className={classes.fieldTitle}>Email</Typography>
          <TextField variant={'outlined'} value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <div className={classes.buttonsWrapper}>
          <Button onClick={handleSubmit}>
            Send reset link
          </Button>
        </div>
        {serverError}
      </Paper>
    </div >
  )
}
export default LoginForgot
