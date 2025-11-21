import { Search, X } from "lucide-react";

const SearchInput = ({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="cinema-input py-2.5 pl-10 pr-10 text-xs font-medium"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(""))}
          aria-label="Clear search query"
          className="absolute right-3 top-2.5 rounded-md p-1 text-muted hover:text-theme focus:outline-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
