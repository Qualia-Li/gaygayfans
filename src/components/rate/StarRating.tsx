"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (stars: number) => void;
  disabled?: boolean;
}

export default function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`text-2xl transition-transform ${
            disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          onClick={() => !disabled && onChange(star)}
        >
          <span
            className={
              star <= (hover || value) ? "text-yellow-400" : "text-gray-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
