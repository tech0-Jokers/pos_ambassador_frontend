import React from "react";

interface SalesExpenseCardProps {
  sales: number;
  expense: number;
}

const SalesExpenseCard: React.FC<SalesExpenseCardProps> = ({
  sales,
  expense,
}) => {
  return (
    <div className="p-6 bg-white shadow rounded-md flex flex-col items-center justify-center">
      <p className="text-3xl font-bold text-purple-900">
        売り上げ: {sales.toLocaleString()}円
      </p>
      <p className="text-3xl font-bold text-purple-900 mt-2">
        費用: {expense.toLocaleString()}円
      </p>
    </div>
  );
};

export default SalesExpenseCard;
