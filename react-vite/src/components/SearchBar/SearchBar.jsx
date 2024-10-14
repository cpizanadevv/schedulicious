import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import * as recipeActions from '../../redux/recipe'
import { useDispatch } from "react-redux";

function SearchBar() {
  const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const handleInput = (e) => {
        setQuery(e.target.value);
    }

  // useEffect(() => {
  //   if (query.length > 0) {
  //     fetchSearchResults();
  //   }
  // }, [query]);

  const fetchSearchResults = () => {
    setIsLoading(true);

    dispatch(recipeActions.searchQuery(query))
    setQuery('')
    setIsLoading(false);
  }

  const handleEnter = (e) => {
    if(e.key == 'Enter'){
      fetchSearchResults()
    }
  }

  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search for a Recipe"
        className="search-bar"
        onChange={handleInput}
        value={query}
        onKeyDown={handleEnter}
      />
      <div className="search-icon" onClick={fetchSearchResults}>
        <FaSearch />
      </div>
      {/* {isLoading && <div>Loading...</div>}
      {results.length > 0 && (
        <ul className="search-results">
            {results.map((result) => (
                <li key={result.id}>
                    {result.tag}
                </li>
            ))}
        </ul>
      )} */}
    </div>
  );
}

export default SearchBar;
