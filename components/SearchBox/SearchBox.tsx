import css from "./SearchBox.module.css";

interface SearchBoxProps {
  searchQuery: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ searchQuery, onSearch }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Пошук нотаток..."
      value={searchQuery}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
