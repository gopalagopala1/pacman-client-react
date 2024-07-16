import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/footer";
import Main from "./components/main/main";

const authUrl = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/auth`
  : "http://localhost:8080/auth";

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get(authUrl, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUser(res.data.user);
        });
    }
  }, []);

  return (
    <div className="App">
      <div id="subRoot">
        <Main user={user} />
      </div>
      <Footer />
    </div>
  );
}
