type FilterValue = { label: string; value: string | number };

const ButtonOptions = ({
  options,
  filterKey,
  appliedFilters,
  setAppliedFilters,
}: {
  options: FilterValue[];
  filterKey: string;
  appliedFilters: { [key: string]: any };
  setAppliedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}) => {
  const selected = appliedFilters[filterKey] || [];

  const toggleOption = (value: string | number) => { 
    setAppliedFilters((prev) => {
      const current = prev[filterKey] || [];
      const isSelected = current.includes(value);

      const updated = isSelected
        ? current.filter((v: any) => v !== value)
        : [...current, value];

      if (updated.length === 0) {
        const { [filterKey]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [filterKey]: updated };
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => toggleOption(opt.value)}
          className={`border px-3 py-1 rounded transition ${
            selected.includes(opt.value) ? "border-black" : "border-gray-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonOptions;
