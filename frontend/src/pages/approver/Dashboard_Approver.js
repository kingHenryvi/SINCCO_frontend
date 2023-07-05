import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

export default function ApproverDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  const navigate = useNavigate();
  const [clickedTab, setClickedTab] = useState(useLocation().pathname);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (clickedTab == "/approverDashboard")
        document.getElementById("approver-dashboard").style = "color:rgb(160, 147, 161)";
      else document.getElementById("approver-dashboard").style = "color:#F4EEE0";

      if (clickedTab == "/approverDashboard/applications")
        document.getElementById("applications").style = "color:rgb(160, 147, 161)";
      else document.getElementById("applications").style = "color:#F4EEE0";
    }
  }, [isLoggedIn, navigate, clickedTab]);

  function logout() {
    new Cookies().remove("authToken", { path: "/" });
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userID");
    setIsLoggedIn(false);
  }

  return (
    <>
      <div id="dashboard">
        <div id="nav-div">
          <div id="nav-logo" />
          <nav>
            <ul id="nav-ul">
              <li id="approver-dashboard">
                <Link to={"/approverDashboard"} onClick={() => {
                  setClickedTab("/approverDashboard");
                }}>Home</Link>
              </li >
              <li id="applications">
                <Link to={"/approverDashboard/applications"} onClick={() => {
                  setClickedTab("/approverDashboard/applications");
                }}>Manage User Applications</Link>
              </li>
            </ul>
          </nav>
          <a id="logout-button">
            <button onClick={logout}>Log Out</button>
          </a>
        </div>
        <Outlet />
      </div>
    </>
  );
}
