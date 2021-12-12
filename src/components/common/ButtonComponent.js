import React from "react";

function ButtonComponent({
  children,
  height,
  width,
  fontSize,
  onClick,
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
    cursor: "pointer",
  };
  return (
    <button type="submit" style={style} onClick={onClick}>
      {children}
    </button>
  );
}

export default ButtonComponent;
