import React from "react";
import { useState, useEffect } from "react";

export default function CSVImportComponent(props) {
  const [CSVFile, setCSVFile] = useState(null);
  const [fileNameColor, setFileNameColor] = useState("red");

  function assignAdviser(adviserStudent) {
    fetch("http://localhost:3001/assign-advisers-to-students-by-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adviserStudent: adviserStudent,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert("Successfully mapped advisers to students");
          props.func();
        } else {
          alert(`An error occured while assigning advisers! Failed Assignment: ${body.failedAssignment}`);
        }
      });
  }

  const uploadCSV = (event) => {
    const csvFile = event.target.files[0];
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];
    const selectedFileName = selectedFile ? selectedFile.name : "";
    const selectedFileNameElement = document.getElementById("selected-file-name");
    selectedFileNameElement.textContent = selectedFileName;
    setCSVFile(csvFile);
    setFileNameColor("green");
  };

  async function submitCSV(e) {
    e.preventDefault();
    if (CSVFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target.result;
        const lines = csvContent.split("\n");
        assignAdviser(lines);
      };
      reader.readAsText(CSVFile);
    } else {
      console.log("No file selected.");
    }
  }

  return (
    <div id="csv-uploader-div">
      <h2 id="csv-upload-title">Map Advisers to Students</h2>
      <span id="selected-file-name" style={{ color: fileNameColor }}>
        No file selected
      </span>
      <form onSubmit={submitCSV}>
        <label for="csv-file" id="file-upload">
          Choose CSV File
        </label>
        <input id="csv-file" type="file" accept=".csv" onChange={uploadCSV} />
        <button id="upload-csv-button" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
}
