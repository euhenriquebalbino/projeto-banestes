import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearch,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className="search-filter">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Campo de busca"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={handleClear}
            aria-label="Limpar busca"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
