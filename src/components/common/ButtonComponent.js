import React from "react";

function ButtonComponent({
  children,
  height,
  width,
  fontSize,
  onClick,
  cursor = "pointer",
  backgroundColor = "white",
}) {
  //style
  const style = {
    backgroundColor,
    height,
    width,
    fontSize,
    fontFamily: "inherit",
    borderRadius: "10px",
    fontWeight: 500,
    border: "1px solid #bbb",
    cursor,
  };
  return (
    <button type="submit" style={style} onClick={onClick}>
      {children}
    </button>
  );
}

export default ButtonComponent;
