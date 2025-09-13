type FilterValue = { label: string; value: string | number };

const ColorCircles = ({
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
  const toggleColor = (value: string) => {
    setAppliedFilters((prev) => {
      const existing = prev[filterKey] || [];
      const newValues = existing.includes(value)
        ? existing.filter((c: string) => c !== value) 
        : [...existing, value];

      if (newValues.length === 0) {
        const { [filterKey]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [filterKey]: newValues };
    });
  };

  const selected = appliedFilters[filterKey] || [];

  if (!Array.isArray(options)) {
    return <div className="text-red-500">Filters data is invalid.</div>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt, i) => (
        <div
          key={i}
          title={opt.label}
          onClick={() => toggleColor(opt.label as string)}
          style={{ backgroundColor: opt.value as string }}
          className={`w-6 h-6 rounded-full border cursor-pointer ${
            selected.includes(opt.value)
              ? "border-black scale-110"
              : "border-gray-300"
          } transition-transform`}
        ></div>
      ))}
    </div>
  );
};

export default ColorCircles;
