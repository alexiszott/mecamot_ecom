import { Range, getTrackBackground } from "react-range";
import { useState } from "react";

const MIN = 0;
const MAX = 1000;

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  onChange,
}: {
  minPrice: number;
  maxPrice: number;
  onChange: (values: number[]) => void;
}) {
  const [values, setValues] = useState([minPrice, maxPrice]);

  return (
    <div className="w-full">
      <p className="text-sm text-gray-700 mb-2">
        Prix : {values[0]} € – {values[1]} €
      </p>

      <Range
        values={values}
        step={10}
        min={MIN}
        max={MAX}
        onChange={(vals) => {
          setValues(vals);
          onChange(vals);
        }}
        renderTrack={({ props, children }) => (
          <div
            ref={props.ref}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              height: "6px",
              width: "100%",
              background: getTrackBackground({
                values,
                colors: ["#d1d5db", "#10b981", "#d1d5db"],
                min: MIN,
                max: MAX,
              }),
              borderRadius: "4px",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              style={{
                height: "20px",
                width: "20px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                outline: "none",
                ...rest.style,
              }}
            />
          );
        }}
      />
    </div>
  );
}
