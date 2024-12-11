import React, { useState, useEffect, useRef } from "react";
import data from "./data";
import "./App.css";
import SearchMetadata from "./SearchMetadata";
import ResultsList from "./ResultsList";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const [searchResults, setSearchResults] = useState([]);
  const [searchMetadata, setSearchMetadata] = useState({});
  const [loading, setLoading] = useState(false); // New loading state
  const inputRef = useRef(null);

  // Focus the input on load
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // Load search history from localStorage when the app starts
    const savedHistory = localStorage.getItem("searchHistory");

    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory)); // Parse only if the data exists
      } catch (e) {
        console.error("Error parsing search history from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save search history to localStorage when it changes
    if (searchHistory.length > 0) {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // Update suggestions on input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = data
        .filter((item) =>
          item.title.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length === 0 && inputValue) {
      const filteredSuggestions = data
        .filter((item) =>
          item.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    setTimeout(() => setSuggestions([]), 100); // Small delay to allow click events
  };

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const startTime = performance.now();

      // Simulate a delay for loading (e.g., API request)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = data.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      const endTime = performance.now();

      setSearchResults(results);
      setSearchMetadata({
        count: results.length,
        time: (endTime - startTime).toFixed(2),
      });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionClick = (item) => {
    setInputValue(item.title);
    setSearchHistory((prev) => [...new Set([item.title, ...prev])]);
    performSearch(item.title);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setFocusedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedSuggestion !== -1) {
      handleSuggestionClick(suggestions[focusedSuggestion]);
    }
  };

  // Handle input clear
  const handleClearInput = () => {
    setInputValue("");
    setSuggestions([]);
    setSearchResults([]);
    setSearchMetadata({});
  };

  const handleRemoveFromHistory = (title) => {
    setSearchHistory((prev) => prev.filter((item) => item !== title));
  };

  // Handle direct input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      performSearch(inputValue);
      setSearchHistory((prev) => [...new Set([inputValue, ...prev])]);
    }
  };

  return (
    <div className="App">
      <form className="search-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          placeholder="Search..."
          className="search-input"
          data-testid="search-input"
        />
        <button
          type="button"
          onClick={handleClearInput}
          className="clear-button"
          data-testid="clear-button"
        >
          ✖
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list" data-testid="suggestions-list">
            {suggestions.map((item, index) => {
              const isInSearchHistory = searchHistory.includes(item.title);
              return (
                <li
                  key={item.id}
                  className={`suggestion-item ${
                    index === focusedSuggestion ? "focused" : ""
                  }`}
                  style={{
                    color: isInSearchHistory ? "purple" : "black",
                  }}
                  data-testid={`suggestion-item-${item.id}`}
                >
                  <span
                    onMouseDown={() => handleSuggestionClick(item)}
                    onClick={() => handleSuggestionClick(item)}
                    data-testid={`suggestion-title-${item.id}`}
                  >
                    {item.title}
                  </span>
                  {isInSearchHistory && (
                    <button
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromHistory(item.title);
                      }}
                      data-testid={`remove-button-${item.title}`}
                    >
                      Remove
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </form>
      {loading && (
        <div
          style={{ width: "150px", height: "150px" }}
          data-testid="loading-indicator"
        >
          <div class="loading loading--full-height"></div>
        </div>
      )}

      <SearchMetadata count={searchMetadata.count} time={searchMetadata.time} />
      <ResultsList results={searchResults} />
    </div>
  );
};

export default App;
