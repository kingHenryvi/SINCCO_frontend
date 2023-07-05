import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
              <li>
                <Link to={"/adminDashboard"}>Home</Link>
              </li>
              <li>
                <Link to={"/adminDashboard/student-applications"}>Manage User Applications</Link>
              </li>
              <li>
                <Link to={"/adminDashboard/approver-applications"}>Manage Approver Accounts</Link>
              </li>
              <li>
                <Link to={"/adminDashboard/clearance-applications"}>Manage Clearance Applications</Link>
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
