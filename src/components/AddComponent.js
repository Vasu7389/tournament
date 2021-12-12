import React, { useState } from "react";
import "./AddComponent.css";

function AddComponent({
  listHandler,
  buttonText,
  inputPlaceholder,
  height,
  width,
}) {
  const [inputText, setInputText] = useState("");

  return (
    <div className="addComponent" style={{ height, width }}>
      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        type="text"
        className="addComponent-input"
        placeholder={inputPlaceholder}
      />
      <button
        type="submit"
        onClick={() => {
          setInputText("");
          return listHandler(inputText);
        }}
        className="addComponent-button"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default AddComponent;
