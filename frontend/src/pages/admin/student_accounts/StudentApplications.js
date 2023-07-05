import React from "react";
import { useState, useEffect } from "react";
import ApplicationComponent from "./ApplicationComponent";
import Select from "react-select";
import ApplicationDataGrid from "./TableComponent";
import CSVImportComponent from "./ImportCSVComponent";
export default function StudentApplications() {
  const [forApproval, setForApproval] = useState([]);

  useEffect(() => {
    getAllAccountsForApproval();
  }, []);

  function getAllAccountsForApproval() {
    fetch("http://localhost:3001/get-accounts-for-approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((body) => {
        setForApproval(body);
      });
  }

  return (
    <div style={{ overflow: "auto", height: "78vh" }} className="page">
      <CSVImportComponent
        func={() => {
          getAllAccountsForApproval();
        }}
      />
      <div id="account-application-table">
        <ApplicationDataGrid
          forApproval={forApproval}
          func={() => {
            getAllAccountsForApproval();
          }}
        />
      </div>
    </div>
  );
}
