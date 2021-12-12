import React from "react";

function TableComponent({ columns = [], rows = [] }) {
  rows =
    rows.length > 0 &&
    rows.sort((a, b) => {
      if (b[8] - a[8] > 0) return 1;
      else if (b[8] - a[8] < 0) return -1;
      else if (b[7] - a[7] > 0) return 1;
      else if (b[7] - a[7] < 0) return -1;
      else return 0;
    });
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr style={{ fontWeight: 700 }}>
          {columns.map((column) => (
            <td>{column}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            {row.map((item) => (
              <td>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableComponent;
