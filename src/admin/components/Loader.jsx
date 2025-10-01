import React from "react";
import RingLoader from "react-spinners/RingLoader";

const Loader = ({ size = 80, color = "#36d7b7", loading = true }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RingLoader color={color} size={size} loading={loading} />
    </div>
  );
};

export default Loader;
