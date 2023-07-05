import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Select from "react-select";
export default function ApplicationApproverDataGrid(props) {
  const userID = sessionStorage.getItem("userID");
  //   const userID = localStorage.getItem("userID");
  const [pending, setPending] = useState([]);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    getAllPendingApplications();
  }, []);

  function getAllPendingApplications() {
    fetch("http://localhost:3001/get-applications-by-approver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    })
      .then((response) => response.json())
      .then((body) => {
        setPending(body);
      });
  }

  function approve(id) {
    console.log(id);
    fetch("http://localhost:3001/approve-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectID: id,
        message: remark,
        status: "Pending",
        step: 2,
        stepgiven: 1,
        commenter: userID,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert(`Student application ${id} was approved`);
          getAllPendingApplications();
        } else {
          alert(`Error`);
        }
      });
  }

  function returnApplication(id) {
    fetch("http://localhost:3001/reject-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectID: id,
        message: remark,
        status: "Open",
        step: 1,
        stepgiven: 1,
        commenter: userID,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          alert(`Student application ${id} was returned`);
          getAllPendingApplications();
        } else {
          alert(`Error`);
        }
      });
  }

  function showPending() {
    getAllPendingApplications();
    console.log(pending);
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Application ID",
      width: 250,
      valueGetter: (params: GridValueGetterParams) => `${params.row._id || ""}`,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      editable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.owner.firstname || ""} ${
          params.row.owner.lastname || ""
        }`,
    },
    {
      field: "owner",
      headerName: "Student Number",
      filter: "text",
      width: 200,
      sortable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.owner.stdnum || ""}`,
    },

    {
      field: "student_submission_date",
      headerName: "Date Submitted",
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        const submission = params.row.student_submission;

        const date = new Date(submission[submission.length - 1].date);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
        return `${formattedDate || ""}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      filter: "text",
      width: 200,
      sortable: true,
    },
    {
      field: "student_submission_remark",
      headerName: "Github Link",
      width: 400,
      renderCell: (params) => {
        const submission = params.row.student_submission;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div>
              Link:{" "}
              <a
                style={{ color: "blue" }}
                href={submission[submission.length - 1].github}
              >
                {submission[submission.length - 1].github}
              </a>
            </div>
            <div>Remark: {submission[submission.length - 1].remark}</div>
          </div>
        );
      },
    },
    {
      field: "approver_remark",
      headerName: "Remark",
      width: 400,
      renderCell: (params) => {
        return (
          <div>
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
              placeholder="Enter remark here"
            ></textarea>
          </div>
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
    <Box sx={{ height: "70vh", width: "90%" }}>
      <DataGrid
        rows={pending}
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
        disableRowSelectionOnClick
      />
    </Box>
  );
}
