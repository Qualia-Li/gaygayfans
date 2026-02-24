"use client";

import { Button } from "@radix-ui/themes";

interface BestPickerProps {
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function BestPicker({ selected, onToggle, disabled }: BestPickerProps) {
  return (
    <Button
      variant={selected ? "solid" : "soft"}
      color="orange"
      size="1"
      disabled={disabled}
      onClick={onToggle}
      className="cursor-pointer"
    >
      {selected ? "★ Best" : "Best?"}
    </Button>
  );
}
