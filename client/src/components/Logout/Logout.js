import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { attemptLogout } from "../../store/thunks/auth";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(attemptLogout());
    dispatch(push("/entrants"));
    // eslint-disable-next-line
  }, []);

  return <p>Logout in progress</p>;
}
export default Logout
