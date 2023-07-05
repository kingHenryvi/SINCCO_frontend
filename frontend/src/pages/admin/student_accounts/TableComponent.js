import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Select from "react-select";
export default function ApplicationDataGrid(props) {
  const [approvers, setApprovers] = useState([]);
  const [selectedAdviser, setSelectedAdviser] = useState([]);
  const [advisers, setAdvisers] = useState([{ label: "Assign adviser", value: "Null" }]);

  const [temp, setTemp] = useState([{ label: "Assign Adviser", value: "Null" }]);
  const [selected, setSelection] = useState([]);

  useEffect(() => {
    getAllApprovers();
    createDropDown();
  }, []);

  function approveStudentAccount() {
    fetch("http://localhost:3001/approve-student-accounts", {
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
          alert("Successfully approve account/s!");
          props.func();
        } else {
          alert("Error approving account.");
        }
      });
  }

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

  function createDropDown() {
    approvers.forEach((element) => {
      var name = element.lastname.concat(", ", element.firstname, " ", element.middlename);
      temp.push({ label: name, value: element._id });
      setAdvisers(temp);
    });
    setTemp([{ label: "Assign Adviser", value: "Null" }]);
  }

  function showDropdown() {
    console.log(advisers);
    console.log(approvers);
  }

  function handleChange(opt) {
    setSelectedAdviser(opt);
  }

  function assignAdviser(stdnum) {
    fetch("http://localhost:3001/assign-adviser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stdnum: stdnum, adviserID: selectedAdviser.value }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert(`Adviser ${selectedAdviser.label} was assigned to user with id: ${stdnum}`);
        } else {
          alert(`Error`);
        }
      });
  }

  function approveAccount(userID, adviserID) {
    if (selectedAdviser.length != 0 && selectedAdviser != "Null") {
      fetch("http://localhost:3001/approve-account-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: userID, adviserID: adviserID }),
      })
        .then((response) => response.json())
        .then((body) => {
          if (body.success) {
            alert("Account approved.");
            props.func();
          } else alert("Account approval failed.");
        });
    } else {
      alert("Select adviser first.");
    }
  }

  function rejectAccount(id) {
    fetch("http://localhost:3001/reject-account-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: id }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) alert("Account rejected.");
        else alert("Account rejection failed.");
      });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "Account ID", width: 200 },
    {
      field: "firstname",
      headerName: "First Name",
      width: 200,
      editable: false,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      width: 200,
      editable: false,
    },
    {
      field: "middlename",
      headerName: "Middle Name",
      width: 200,
      editable: false,
    },

    {
      field: "userType",
      headerName: "Type of User",
      width: 200,
      editable: false,
    },
    {
      field: `stdnum`,
      headerName: "Student Number",
      width: 200,
      editable: false,
    },
    {
      field: "select",
      headerName: "Assign Adviser",
      width: 250,
      renderCell: (params) => {
        const handleSelectChange = (event) => {
          console.log(event.target.value);
          setSelectedAdviser(event.target.value);
        };

        return (
          <select id="assign-adviser" value={params.value} onChange={handleSelectChange} onClick={createDropDown}>
            {advisers.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      field: "action1",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        const handleButtonClick = () => {
          // Handle button click
          console.log("Button clicked for row with ID:", params.row.id);
          approveAccount(params.row.id, selectedAdviser);
          console.log(selectedAdviser);
        };

        return (
          <button id="approve-button" onClick={handleButtonClick}>
            Approve
          </button>
        );
      },
    },
    {
      field: "action2",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        const handleButtonClick = () => {
          console.log("Button clicked for row with ID:", params.row.id);
          rejectAccount(params.row.id);
        };

        return (
          <button id="return-button" onClick={handleButtonClick}>
            Reject
          </button>
        );
      },
    },
  ];

  function getSelections() {
    console.log(selected);
  }

  return (
    <Box sx={{ height: "50vh", width: "78%", placeSelf: "center" }}>
      <DataGrid
        rows={props.forApproval}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[6]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => {
          setSelection(newSelection);
        }}
      />
      <button id="dropdown-button" onClick={showDropdown}>
        Show Dropdown
      </button>
    </Box>
  );
}
