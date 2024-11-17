import React from "react";

interface ChartTooltipContentProps {
  payload: { name: string; value: number }[];
  label: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  payload,
  label,
}) => (
  <div className="chart-tooltip-content">
    <p>{label}</p>
    {payload &&
      payload.map((entry, index) => (
        <p key={`item-${index}`}>{`${entry.name}: ${entry.value}`}</p>
      ))}
  </div>
);
