import React from "react";

function CardComponent({
  children,
  backgroundColor = "white",
  color = "inherit",
  fontWeight = "700",
  width = "auto",
}) {
  const style = {
    backgroundColor,
    color,
    fontWeight,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    padding: "20px",
    borderRadius: "18px",
    margin: "10px",
    display: "flex",
    flexDirection: "column",
    width,
    alignItems: "center",
  };
  return <div style={style}>{children}</div>;
}

export default CardComponent;
