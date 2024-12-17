import React, { useState } from "react";

interface WordCloudsProps {
  wordCloudData: Record<string, string>; // APIからのデータをそのまま受け取る
}

function WordClouds({ wordCloudData }: WordCloudsProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // 初期表示として最初の商品を選択
  const productNames = Object.keys(wordCloudData);
  if (!selectedProduct && productNames.length > 0) {
    setSelectedProduct(productNames[0]);
  }

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white w-full h-full flex flex-col">
      <h2 className="text-lg font-bold text-center mb-4">ワードクラウド</h2>

      {/* プルダウンメニュー */}
      <select
        className="border rounded p-2 w-full mb-4"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {productNames.map((productName, index) => (
          <option key={index} value={productName}>
            {productName}
          </option>
        ))}
      </select>

      {/* 選択された商品の画像を表示 */}
      {selectedProduct && (
        <div className="flex justify-center items-center">
          <img
            src={`data:image/png;base64,${wordCloudData[selectedProduct]}`}
            alt={`Word Cloud for ${selectedProduct}`}
            className="rounded shadow-md max-w-full max-h-60"
          />
        </div>
      )}
    </div>
  );
}

export default WordClouds;