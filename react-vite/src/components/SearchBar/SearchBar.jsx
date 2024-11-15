import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as recipeActions from "../../redux/recipe";

function SearchBar() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const currPg = 1;
  const perPage = 5;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    dispatch(recipeActions.getAllRecipes(currPg, perPage,query));
  };

  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search for a Recipe"
        className="search-bar"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={handleKeyPress}
      />
      <div className="search-icon" onClick={handleSearch}>
        <FaSearch />
      </div>
    </div>
  );
}

export default SearchBar;
