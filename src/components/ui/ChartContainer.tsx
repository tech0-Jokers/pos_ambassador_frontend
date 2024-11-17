import React, { ReactNode } from "react";

interface ChartContainerProps {
  children: ReactNode;
  className: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;
