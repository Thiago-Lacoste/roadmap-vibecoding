function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar roadmaps..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBar
