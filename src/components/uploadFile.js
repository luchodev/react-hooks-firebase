import React from "react";

const uploadFile = ({ handleUpload }) => {
  return (
    <input type="file" className="inputFile" onChange={handleUpload}></input>
  );
};

export default uploadFile;
