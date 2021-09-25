import type { NextPage } from "next";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Icon, IconButton, Paper } from "@mui/material";
import Layout from "../components/layout";
import { DeleteForever, Edit } from "@mui/icons-material";
import { MouseEvent } from "react";

const rows: GridRowsProp = new Array(100)
  .fill({
    id: 1,
    name: "foo",
    type: "bar",
    amount: "10",
    sellIn: "10",
  })
  .map((h, i) => ({ ...h, id: i }));

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "amount", headerName: "Amount", width: 150 },
  { field: "sellIn", headerName: "Sell in", width: 150 },
  {
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    field: "actions",
    headerName: "",
    disableExport: true,
    renderCell: () => {
      const onClick = (event: MouseEvent) => {
        event.stopPropagation();
        // TODO: implement action buttons
      };

      return (
        <>
          <IconButton aria-label="Example" onClick={onClick}>
            <Edit />
          </IconButton>
          <IconButton aria-label="Example" onClick={onClick}>
            <DeleteForever />
          </IconButton>
        </>
      );
    },
  },
];

const Home: NextPage = () => {
  return (
    <Layout>
      <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Paper>
    </Layout>
  );
};

export default Home;
