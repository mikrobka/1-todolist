// Router.js
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/todolists-list/TodolistsList";
import { Login } from "features/auth/login/login";

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={"/"} element={<TodolistsList />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </HashRouter>
  );
};
