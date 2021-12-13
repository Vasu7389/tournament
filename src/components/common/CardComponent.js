import React from "react";

function CardComponent({ children, backgroundColor = "white" }) {
  const style = {
    backgroundColor,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    padding: "20px",
    borderRadius: "18px",
    color: "white",
    fontWeight: "700",
    margin: "10px",
  };
  return <div style={style}>{children}</div>;
}

export default CardComponent;
