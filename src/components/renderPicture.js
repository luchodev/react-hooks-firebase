import React from "react";

const renderPicture = ({ picture }) => {
  return (
    <>
      <img
        className="profileImage"
        src={picture.photoURL}
        alt={picture.displayName}
      />
      <span>{picture.displayName}</span>
      <img className="image" src={picture.image} alt={picture.displayName} />
    </>
  );
};

export default renderPicture;
