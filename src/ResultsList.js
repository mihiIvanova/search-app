import React from "react";

const ResultsList = ({ results }) => {
  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id} className="result-item">
          <a href="#" className="result-title">
            {result.title}
          </a>
          <p className="result-description">{result.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default ResultsList;
