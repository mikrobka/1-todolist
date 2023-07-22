import React from "react";
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useActions } from "common/hooks";
import { authThunks, selectIsLoggedIn } from "features/auth/login/model";
import { useSelector } from "react-redux";
import { selectAppStatus } from "app/model";

export const Header = () => {
  const { logout } = useActions(authThunks);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const status = useSelector(selectAppStatus);

  const logoutHandler = () => logout(null);
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
    </div>
  );
};
