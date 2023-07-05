import React from "react";
import { useState, useEffect } from "react";
import ApplicationApproverDataGrid from "./TableComponent";

export default function Applications() {
  const userID = sessionStorage.getItem("userID");

  return (
    <>
      <div id="application-for-approver">
        <ApplicationApproverDataGrid />
      </div>
    </>
  );
}
