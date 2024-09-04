import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useEffect, useState } from "react";

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e) => {
        setQuery(e.target.value);
    }


  useEffect(() => {
    if (query.length > 0) {
      fetchSearchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setIsLoading(true);

    const res = await fetch()
    const data = res.json();

    setResults(data)
    setIsLoading(false);
  }

  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search for a Recipe"
        className="search-bar"
        onChange={handleInput}
        value={query}
      />
      <div className="search-icon">
        <FaSearch />
      </div>
      {results.length > 0 && (
        <ul className="search-results">
            {results.map((result) => (
                <li>
                    {result.tag}
                </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
