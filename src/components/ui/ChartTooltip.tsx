import React, { ReactNode } from "react";

interface ChartTooltipProps {
  content: ReactNode;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ content }) => (
  <div className="chart-tooltip">{content}</div>
);
