import { React, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function ApproverDataGrid(props) {
  const columns: GridColDef[] = [
    { field: "_id", headerName: "User ID", width: 250 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      editable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstname || ""} ${params.row.lastname || ""}`,
    },
    {
      field: "userType",
      headerName: "User Type",
      width: 200,
      editable: false,
    },

    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
  ];

  return (
    <Box
      sx={{
        height: "68vh",
        width: "85%",
        placeSelf: "center",
        border: "solid",
        borderWidth: "1px",
        borderColor: "rgba(57, 54, 70, 0.6)",
      }}
    >
      {/* <h1>{select.map((val) => val.fullName)}</h1> */}
      <DataGrid
        rows={props.info}
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
          props.func(newSelection);
        }}
      />
    </Box>
  );
}
