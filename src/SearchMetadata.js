import React from "react";

const SearchMetadata = ({ count, time }) => {
  return (
    <div className="metadata">
      {count !== undefined
        ? `Found ${count} results in ${time} ms`
        : "No results yet"}
    </div>
  );
};

export default SearchMetadata;
