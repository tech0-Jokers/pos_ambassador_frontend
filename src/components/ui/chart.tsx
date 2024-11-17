// src/components/ui/chart.tsx
import React, { ReactNode } from "react";

interface ChartContainerProps {
  children: ReactNode;
  className: string;
}

interface ChartTooltipProps {
  content: ReactNode;
}

interface ChartTooltipContentProps {
  payload: { name: string; value: number }[];
  label: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ content }) => (
  <div className="chart-tooltip">{content}</div>
);

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
