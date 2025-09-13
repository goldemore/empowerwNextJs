// import ButtonOptions from "./filters/ButtonOptions";
// import CheckboxList from "./filters/CheckboxList";
// import ColorCircles from "./filters/ColorCircles";
// import RangeSlider from "./filters/RangeSlider";

// type Filter = {
//   key: string;
//   type: "range" | "color" | "buttons" | "checkbox";
//   values?: string[];
//   min?: number;
//   max?: number;
// };

// const FilterItemRenderer = ({
//   filter,
//   appliedFilters,
//   setAppliedFilters,
// }: {
//   filter: any;
//   appliedFilters: { [key: string]: any };
//   setAppliedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
// }) => {
//   const commonProps = { filterKey: filter.key, appliedFilters, setAppliedFilters };

//   switch (filter.type) {
//     case "range":
//       return <RangeSlider {...filter} {...commonProps}  />;
//     case "color":
//       return <ColorCircles colors={filter.values!} {...commonProps} />;
//     case "buttons":
//       return <ButtonOptions options={filter.values!} {...commonProps} />;
//     case "checkbox":
//     default:
//       return <CheckboxList options={filter.values!} {...commonProps} />;
//   }
// };

// export default FilterItemRenderer;
