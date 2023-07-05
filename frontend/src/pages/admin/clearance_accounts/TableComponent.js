import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Select from "react-select";
export default function ClearanceApplicationDataGrid(props) {
  const userID = sessionStorage.getItem("userID");
  const [forApproval, setForApproval] = useState([]);
  const [remark, setRemark] = useState("");
  useEffect(() => {
    getAllAccountsForClearance();
  }, []);

  function getAllAccountsForClearance() {
    fetch("http://localhost:3001/get-accounts-for-clearance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((body) => {
        setForApproval(body);
      });
  }

  function approve(id) {
    console.log(id);
    fetch("http://localhost:3001/approve-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectID: id,
        status: "Cleared",
        message: remark,
        step: 3,
        stepgiven: 2,
        commenter: userID,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert(`Student application ${id} was approved`);
          getAllAccountsForClearance();
        } else {
          alert(`Error`);
        }
      });
  }

  function returnApplication(id) {
    fetch("http://localhost:3001/reject-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: id, message: remark, status: "Open", step: 2, stepgiven: 2, commenter: userID }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert(`Student application ${id} was returned`);
          getAllAccountsForClearance();
        } else {
          alert(`Error`);
        }
      });
  }

  function displayStep(step) {
    if (step == 1) {
      return <p>Remarked by adviser</p>;
    } else if (step == 2) {
      return <p>Remarked by clearance officer</p>;
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "Application ID", width: 250 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.owner.firstname || ""} ${params.row.owner.lastname || ""}`,
    },
    {
      field: "owner",
      headerName: "Student Number",
      filter: "text",
      width: 200,
      sortable: true,
      valueGetter: (params: GridValueGetterParams) => `${params.row.owner.stdnum || ""}`,
    },

    {
      field: "status",
      headerName: "Status",
      filter: "text",
      width: 200,
      sortable: true,
    },
    {
      field: "submissions",
      headerName: "Submissions",
      width: 500,

      renderCell: (params) => {
        const submissions = params.row.student_submission;

        return (
          <div style={{ overflowY: "scroll", maxHeight: "200px" }}>
            {submissions.map((submission, index) => {
              return (
                <div
                  key={index}
                  style={{ backgroundColor: "white", margin: "10px", padding: "10px", borderRadius: "5px" }}
                >
                  <p>{submission.date}</p>
                  <a href={submission.github}>{submission.github}</a>
                  <p>{submission.remark}</p>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 500,

      renderCell: (params) => {
        const remarks = params.row.remarks;

        return (
          <div style={{ overflowY: "scroll", maxHeight: "200px" }}>
            {remarks.map((remark, index) => {
              return (
                <div
                  key={index}
                  style={{ backgroundColor: "white", margin: "10px", padding: "10px", borderRadius: "5px" }}
                >
                  <p>{remark.date}</p>
                  <p>{remark.remark}</p>
                  {displayStep(remark.stepgiven)}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "comment",
      headerName: "Comment",
      width: 500,

      renderCell: (params) => {
        const remarks = params.row.remarks;
        return (
          <textarea
            type="text"
            onChange={(e) => {
              setRemark(e.target.value);
              console.log(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.stopPropagation();
              }
            }}
            style={{
              height: "100px",
              width: "380px",
              resize: "none",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid lightgray",
            }}
            placeholder="Enter comment here"
          ></textarea>
        );
      },
    },

    {
      field: "return",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div id="return-button">
            <button
              onClick={() => {
                returnApplication(params.row.id);
              }}
            >
              Return
            </button>
          </div>
        );
      },
    },
    {
      field: "approve",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div id="approve-button">
            <button
              onClick={() => {
                approve(params.row.id);
              }}
            >
              Approve
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ paddingTop: "20px", height: "70vh", width: "82%", placeSelf: "center" }}>
      <DataGrid
        rows={forApproval}
        columns={columns}
        getRowHeight={() => 200}
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
      />
    </Box>
  );
}
