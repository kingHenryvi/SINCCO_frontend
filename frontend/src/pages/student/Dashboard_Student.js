import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IconContext } from "react-icons";
import React from "react";

export default function StudentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  const navigate = useNavigate();
  const [clickedTab, setClickedTab] = useState(useLocation().pathname);
  const [notification, setNotification] = useState("No Notification");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (clickedTab == "/student-dashboard")
        document.getElementById("student-dashboard").style = "color:rgb(160, 147, 161)";
      else document.getElementById("student-dashboard").style = "color:#F4EEE0";

      if (clickedTab == "/student-dashboard/application-process")
        document.getElementById("application-process").style = "color:rgb(160, 147, 161)";
      else document.getElementById("application-process").style = "color:#F4EEE0";
    }

    fetch("http://localhost:3001/get-all-applications-of-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: sessionStorage.userID }),
    })
      .then((response) => response.json())
      .then((body) => {
        setNotification("No Notification");
        body.map((application) => {
          if (application.status === "Open") {
            if (application.step === 1) {
              setNotification("Returned By Approver");
            }
            else {
              setNotification("Returned By Clearance Officer");
            }
          }
        });
      });
  }, [isLoggedIn, navigate, clickedTab]);

  function logout() {
    new Cookies().remove("authToken", { path: "/" });
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userID");
    setIsLoggedIn(false);
  }

  function Notification() {
    var color;
    if (notification === "No Notification") color = "rgba(244, 238, 224, .90)"
    else color = "#ffd87e";
    if (showNotification) {
      return (
        <div id="notifications">
          <button id="notif-icon" onClick={() => { setShowNotification(!showNotification) }}>
            <IconContext.Provider id="notif-icon" value={{ color: color, size: "20px" }}>
              <div>
                <MdOutlineNotificationsNone id="notification-icon" />
              </div>
            </IconContext.Provider>
          </button>
          <div id="slay">
            <div id="notif">
              {notification}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ paddingLeft: "30px", paddingTop: "8px" }}>
          <button id="notif-icon" onClick={() => { setShowNotification(!showNotification) }}>
            <IconContext.Provider value={{ color: color, size: "20px" }}>
              <div>
                <MdOutlineNotificationsNone id="notification-icon" />
              </div>
            </IconContext.Provider>
          </button>
        </div>
      );
    }
  }

  return (
    <>
      <div id="dashboard">
        <div id="nav-buffer">
          <div id="nav-div">
            <div id="nav-logo" />
            <nav id="nav-bar">
              <ul id="nav-ul">
                <li id="student-dashboard" className="tab">
                  <Link
                    to={"/student-dashboard"}
                    onClick={() => {
                      setClickedTab("/student-dashboard");
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li id="application-process" className="tab">
                  <Link
                    to={"/student-dashboard/application-process"}
                    onClick={() => {
                      setClickedTab("/student-dashboard/application-process");
                    }}
                  >
                    Application Process
                  </Link>
                </li>
              </ul>
            </nav>
            <div id="right-side-dashboard">
              <Notification />
              <a id="logout-button">
                <button onClick={logout}>Log Out</button>
              </a>
            </div>
          </div>
        </div>
        <Outlet />
      </div >
    </>
  );
}
