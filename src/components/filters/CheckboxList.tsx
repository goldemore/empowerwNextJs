type FilterValue = { label: string; value: string | number };

const CheckboxList = ({
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

  const toggleCheckbox = (value: string | number) => { 
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
    <div className="flex flex-col gap-1">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggleCheckbox(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

export default CheckboxList;
