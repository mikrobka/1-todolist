import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import "./App.css";
import { ErrorSnackbar } from "common/components";
import { useActions } from "common/hooks";
import { selectIsInitialized } from "./model";
import { authThunks } from "features/auth/login/model";
import { Router } from "components/router/router";
import { Header } from "components/header/header";
import { Loading } from "components/loading/loadingin-indicator";

function App() {
  const isInitialized = useSelector(selectIsInitialized);
  const { initializeApp } = useActions(authThunks);

  useEffect(() => {
    initializeApp(null);
  }, [initializeApp, isInitialized]);

  if (!isInitialized) {
    return <Loading />;
  }
  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Container fixed>
        <Router />
      </Container>
    </div>
  );
}

export default App;
