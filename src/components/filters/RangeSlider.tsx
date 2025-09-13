"use client";
import { useState, useEffect, useRef } from "react";
import { Range } from "react-range";

const RangeSlider = ({
  min,
  max,
  filterKey,
  appliedFilters,
  setAppliedFilters,
}: {
  min: number;
  max: number;
  filterKey: string;
  appliedFilters: { [key: string]: any };
  setAppliedFilters: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >;
}) => {
  const STEP = 1;
  const defaultRange = [min, max];

  // Состояние значений
  const [values, setValues] = useState<number[]>(
    appliedFilters[filterKey] || defaultRange
  );

  const [loading, setLoading] = useState(false);

  // --- 🟡 Обновляем local values, если фильтр сброшен извне (например, сброс кнопкой)
  useEffect(() => {
    if (!appliedFilters[filterKey]) {
      setValues(defaultRange);
    }
  }, [appliedFilters, filterKey, min, max]);

  // --- ✅ Основная логика применения фильтра (только при отпускании мыши)
  const handleFinalChange = (newValues: number[]) => {
    setValues(newValues);

    const isDefault = newValues[0] === min && newValues[1] === max;
    setAppliedFilters((prev) => {
      if (isDefault) {
        const { [filterKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [filterKey]: newValues };
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <input
          type="number"
          value={values[0]}
          onChange={(e) =>
            setValues([
              Math.min(Number(e.target.value), values[1] - 1),
              values[1],
            ])
          }
          className="w-20 border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={values[1]}
          onChange={(e) =>
            setValues([
              values[0],
              Math.max(Number(e.target.value), values[0] + 1),
            ])
          }
          className="w-20 border px-2 py-1 rounded"
        />
      </div>

      <Range
        values={values}
        step={STEP}
        min={min}
        max={max}
        onChange={setValues} // Только для UI
        onFinalChange={handleFinalChange} // Только по отпусканию мыши — применяем
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-[88%] bg-gray-200 rounded ml-3 mr-2 mt-4"
            style={{ ...props.style }}
          >
            <div className="absolute inset-0 flex items-center">
              <div
                className="h-full bg-[#5c5c5c] rounded"
                style={{
                  marginLeft: `${((values[0] - min) / (max - min)) * 100}%`,
                  width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
                }}
              />
            </div>
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-5 w-5 border-2 border-[#5c5c5c] bg-white rounded-full"
          />
        )}
      />

      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
