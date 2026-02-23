"use client";

interface BestPickerProps {
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function BestPicker({ selected, onToggle, disabled }: BestPickerProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
        selected
          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      } ${disabled ? "cursor-default opacity-50" : "cursor-pointer"}`}
    >
      {selected ? "★ Best" : "Best?"}
    </button>
  );
}
