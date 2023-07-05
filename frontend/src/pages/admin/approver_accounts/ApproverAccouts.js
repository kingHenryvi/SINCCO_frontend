import React from "react";
import { useState, useEffect } from "react";
import * as EmailValidator from "email-validator";
import ApproverComponent from "./ApproverComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import ApproverDataGrid from "./TableComponent";
export default function ApproverAccounts() {
  const [approvers, setApprovers] = useState([]);
  const [selected, setSelection] = useState([]);
  const [found, setFound] = useState({});
  const [prompt, setPrompt] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getAllApprovers();
  }, []);

  function getAllApprovers() {
    fetch("http://localhost:3001/get-all-approvers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((body) => {
        setApprovers(body);
      });
  }

  function getSelections(selections) {
    console.log(selections);
    setSelection(selections);
  }

  function createApprover(firstname, middlename, lastname, userType, email, password) {
    fetch("http://localhost:3001/add-approver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        userType: userType,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert("Successfully added an approver!");
          getAllApprovers();
        } else {
          alert("Sign up failed");
        }
      });
  }

  async function addApprover(e) {
    e.preventDefault();

    var firstname = document.getElementById("approver-firstname").value;
    var middlename = document.getElementById("approver-middlename").value;
    var lastname = document.getElementById("approver-lastname").value;
    var email = document.getElementById("approver-email").value;
    const password = document.getElementById("approver-password").value;
    const userType = "Approver";

    if (firstname === "" || middlename === "" || lastname === "" || email === "" || password === "") {
      alert("Fill out all the fields");
    } else if (!EmailValidator.validate(email)) {
      alert("Invalid email.");
    } else {
      createApprover(firstname, middlename, lastname, userType, email, password);
      document.getElementById("approver-form").reset();
    }
  }

  function deleteApprover() {
    fetch("http://localhost:3001/delete-approver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selected: selected,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert("Successfully deleted an approver!");
          getAllApprovers();
        } else {
          alert("Error deleting approver.");
        }
      });
  }

  return (
    <div style={{ overflow: "auto" }} className="page">
      <div id="table_form">
        <div id="approvers-table">
          <ApproverDataGrid info={approvers} func={(selections) => getSelections(selections)} />
          <div id="delete-user-button">
            <FontAwesomeIcon icon={faTrash} />
            <button onClick={deleteApprover}>Delete</button>
          </div>
        </div>
        <div>
          <div id="create-approver-div">
            <h1 id="sign-up-text">Create an Approver Account</h1>
            <div id="s-form-eye">
              <form id="approver-form">
                <input id="approver-firstname" placeholder="First Name" />
                <input id="approver-middlename" placeholder="Middle Name" />
                <input id="approver-lastname" placeholder="Last Name" />
                <input id="approver-email" placeholder="UP Mail" />
                <input id="approver-password" type={showPassword ? "text" : "password"} placeholder="Password" />
                <button id="createaccount-button" onClick={addApprover}>
                  Create Account
                </button>
              </form>
              <button id="s2-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
