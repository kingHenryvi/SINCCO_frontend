import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import Cookies from "universal-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInSignUp, setIsInSignUp] = useState(false);
  const [userType, setUserType] = useState("");

  // redirect when login is successful
  useEffect(() => {
    if (isLoggedIn && userType === "Student") {
      navigate("/student-dashboard");
    } else if (isLoggedIn && userType === "Admin") {
      navigate("/adminDashboard");
    } else if (isLoggedIn && userType === "Approver") {
      console.log("HJDSKDHJSHDJS");
      navigate("/approverDashboard");
    }
  }, [isLoggedIn, navigate, isInSignUp, userType]);

  function toggleIsInSignUp() {
    setIsInSignUp(!isInSignUp);
  }

  function Authentication(props) {
    var isInSignUp = props.isInSignUp;
    const [showPassword, setShowPassword] = useState(false);
    if (isInSignUp) {
      return (
        <div id="sign-in-div">
          <h1 id="sign-up-text">Create a SINCCO Account</h1>
          <div id="s-form-eye">
            <form id="sign-up">
              <input id="s-firstname" placeholder="First Name" />
              <input id="s-middlename" placeholder="Middle Name" />
              <input id="s-lastname" placeholder="Last Name" />
              <input id="s-stdnum" placeholder="Student Number" />
              <input id="s-email" placeholder="UP Mail" />
              <input id="s-password" type={showPassword ? "text" : "password"} placeholder="Password" />
            </form>
            <button id="s-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button id="signup-button" onClick={signUp}>
            Sign Up
          </button>
          <div id="authentication-tosignupback-button-div">
            <button id="authentication-back-button" onClick={toggleIsInSignUp}>
              Back
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div id="sign-in-div">
          <div id="sign-in-logo-div">
            <div id="sign-in-logo"></div>
          </div>
          <div id="log-in-div">
            <div id="l-form-eye">
              <form id="log-in">
                <div id="authentication-input-div">
                  <input id="l-email" placeholder="Email" />
                  <input id="l-password" type={showPassword ? "text" : "password"} placeholder="Password" />
                </div>
                <button id="login-button" onClick={logIn}>
                  Log In
                </button>
              </form>
              <button id="l-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <div id="authentication-tosignupback-button-div">
            <button id="authentication-tosignup-button" onClick={toggleIsInSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      );
    }
  }

  function resetForms() {
    document.getElementById("sign-up").reset();
    document.getElementById("log-in").reset();
  }

  function signUpAPIValidation(firstname, middlename, lastname, studentNumber, email, password) {
    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        stdnum: studentNumber,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert("Successfully sign up! Wait for the admin to approve your account.");
          //logInAPIValidation(email, password);
          // setIsLoggedIn(true);
          // // successful log in. store the token as a cookie
          // const cookies = new Cookies();
          // cookies.set("authToken", body.token, {
          //   path: "localhost:3001/",
          //   age: 60 * 60,
          //   sameSite: false,
          // });

          // localStorage.setItem("username", body.username);
          resetForms();
        } else {
          alert("Sign up failed");
        }
      });
  }

  function logInAPIValidation(email, password) {
    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          setIsLoggedIn(true);
          setUserType(body.userType);
          // successful log in. store the token as a cookie
          const cookies = new Cookies();
          cookies.set("authToken", body.token, {
            path: "localhost:3001/",
            age: 60 * 60,
            sameSite: false,
          });

          sessionStorage.setItem("username", body.username);
          sessionStorage.setItem("email", body.email);
          sessionStorage.setItem("userID", body.userID);
          console.log(body.userID);
          console.log(body.username);
          console.log(body.email);
          console.log(sessionStorage);
        } else {
          alert("Log in failed. User does not exist.");
        }
      });
  }

  function signUp(e) {
    e.preventDefault();

    var firstname = document.getElementById("s-firstname").value;
    var middlename = document.getElementById("s-middlename").value;
    var lastname = document.getElementById("s-lastname").value;
    var studentNumber = document.getElementById("s-stdnum").value;
    var email = document.getElementById("s-email").value;
    var password = document.getElementById("s-password").value;

    // form validation goes here
    if (
      firstname === "" ||
      middlename === "" ||
      lastname === "" ||
      studentNumber === "" ||
      email === "" ||
      password === ""
    ) {
      alert("Fill out all the fields");
    } else if (!EmailValidator.validate(email)) {
      alert("Invalid email.");
    } else if (password.length < 8) {
      alert("Weak Password");
    } else {
      signUpAPIValidation(firstname, middlename, lastname, studentNumber, email, password);
    }
  }

  function logIn(e) {
    e.preventDefault();

    var email = document.getElementById("l-email").value;
    var password = document.getElementById("l-password").value;
    if (!EmailValidator.validate(email)) {
      alert("Invalid email.");
    }
    logInAPIValidation(email, password);
    // form validation goes here
  }

  return (
    <>
      <div id="sign-in-page">
        <Authentication isInSignUp={isInSignUp} />
      </div>
    </>
  );
}
