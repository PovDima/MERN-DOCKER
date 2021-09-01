import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper, Typography, TextField } from "@material-ui/core";
import { Redirect, useParams } from "react-router-dom";
import { attemptGetConfirmation } from "../../store/thunks/auth";

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
  title: {
    marginBottom: '10px'
  }
}))
const ConfirmPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch();
  const { token } = useParams();
  const { isAuth } = useSelector((state) => state.user);
  const [serverError, setServerError] = useState("");

  const handleSubmit = () => {
    dispatch(attemptGetConfirmation(token)).catch((error) => {
      if (error.response) {
        setServerError(error.response.data.message);
      }
    });
  }

  return isAuth ? (
    <Redirect to='/entrants' />
  ) : (
    <div className={classes.wrapper}>
      <Paper className={classes.paperWrapper}>
        <Typography className={classes.title}>Click here to confirm your email</Typography>
        <Button onClick={handleSubmit}>Confirmation</Button>
        {serverError}
      </Paper>
    </div>
  );
}

export default ConfirmPage
