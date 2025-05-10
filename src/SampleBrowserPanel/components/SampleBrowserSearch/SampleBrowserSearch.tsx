import React from "react";
import useSampleStore from "../../../Samples/stores/useSamplesStore";
import "./SampleBrowserSearch.scss";

function SampleBrowserSearch() {
  const searchValue = useSampleStore((s) => s.searchValue);
  const setSearchValue = useSampleStore((s) => s.setSearchValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.currentTarget.value);
  }
  function handleClickX() {
    setSearchValue(null);
  }
  return (
    <div className="sample-browser-search">
      <input
        className="sample-browser-search__input"
        type="text"
        value={searchValue ?? ""}
        onChange={handleChange}
      />
      <button
        className="sample-browser-search__clear"
        onClick={handleClickX}
        disabled={!searchValue}
      >
        <span>X</span>
      </button>
    </div>
  );
}

export default SampleBrowserSearch;
