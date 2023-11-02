import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;