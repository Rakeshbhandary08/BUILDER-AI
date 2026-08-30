import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { AuthLayout, GuestLayout } from "./pages/Layout";
import Loading from "./components/Loading";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (

    <>
     <Toaster/>
     <Routes>
      {/* Login Routes */}
      <Route element={<GuestLayout/>}>
        <Route path="/register" element={<AuthPage mode="register" />}></Route>
        <Route path="/login" element={<AuthPage mode="login"/>} />
      </Route>

      {/* Protected Route */}
      <Route  element={<AuthLayout/>}>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/builder/:id" element={<BuilderPage/>} />
        <Route path="/preview/:id" element={<PreviewPage/>} />
      </Route>

      <Route path="*" element={<NotFound/>}></Route>
    </Routes>
    </>
   
  );
};

export default App;
