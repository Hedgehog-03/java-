import React from "react";

import { Redirect, Route } from "react-router-dom";

function AuthRoute({ component: Children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        let token = sessionStorage.getItem("token");
        // let role = sessionStorage.getItem("username");
        if (token) {
          return <Children />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default AuthRoute;
