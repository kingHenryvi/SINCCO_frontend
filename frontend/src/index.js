import React from "react";
import ReactDOM from "react-dom/client";
import { redirect } from "react-router-dom";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import StudentDashboard from "./pages/student/Dashboard_Student";
import AdminDashboard from "./pages/admin/Dashboard_Admin";
import StudentApplications from "./pages/admin/student_accounts/StudentApplications";

// import ApproverApplications from "./pages/admin/approver_accounts/ApproverApplications";
import HomeStudent from "./pages/student/HomeStudent";
import ApplicationProcess from "./pages/student/ApplicationProcess";

import ApproverAccounts from "./pages/admin/approver_accounts/ApproverAccouts";
import MainAdminDashboard from "./pages/admin/MainDashboard_Admin";
import ApproverDashboard from "./pages/approver/Dashboard_Approver";
import MainApproverDashboard from "./pages/approver/MainDashboard_Approver";
import Applications from "./pages/approver/Applications";
import ClearanceApplication from "./pages/admin/clearance_accounts/ClearanceApplication";

// Send a POST request to API to check if the user is logged in. Redirect the user to /dashboard if already logged in
const checkIfLoggedInOnHome = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", {
    method: "POST",
    credentials: "include",
  });

  const payload = await res.json();

  if (payload.isLoggedIn && payload.userType === "Student") {
    return redirect("/student-dashboard");
  } else if (payload.isLoggedIn && payload.userType === "Admin") {
    return redirect("/adminDashboard");
  } else if (payload.isLoggedIn && payload.userType === "Approver") {
    return redirect("/approverDashboard");
  } else {
    return 0;
  }
};

// Send a POST request to API to check if the user is logged in. Redirect the user back to / if not logged in
const checkIfLoggedInOnDash = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", {
    method: "POST",
    credentials: "include",
  });

  const payload = await res.json();
  if (payload.isLoggedIn && payload.userType === "Student") {
    return true;
  } else if (payload.isLoggedIn && payload.userType === "Admin") {
    return true;
  } else if (payload.isLoggedIn && payload.userType === "Approver") {
    return true;
  } else {
    return redirect("/");
  }
};

const router = createBrowserRouter([
  { path: "/", element: <Home />, loader: checkIfLoggedInOnHome },
  {
    path: "/student-dashboard",
    children: [
      { path: "/student-dashboard", element: <HomeStudent /> },
      { path: "/student-dashboard/application-process", element: <ApplicationProcess /> },
    ],
    element: <StudentDashboard />,
    loader: checkIfLoggedInOnDash,
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboard />,
    loader: checkIfLoggedInOnDash,
    children: [
      {
        path: "/adminDashboard",
        element: <MainAdminDashboard />,
      },
      {
        path: "student-applications",
        element: <StudentApplications />,
      },
      {
        path: "approver-applications",
        element: <ApproverAccounts />,
      },
      {
        path: "clearance-applications",
        element: <ClearanceApplication />,
      },
    ],
  },
  {
    path: "/approverDashboard",
    element: <ApproverDashboard />,
    loader: checkIfLoggedInOnDash,
    children: [
      {
        path: "/approverDashboard",
        element: <MainApproverDashboard />,
      },
      {
        path: "applications",
        element: <Applications />,
      },
      // {
      //   path: "approver-applications",
      //   element: <ApproverAccounts />,
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
