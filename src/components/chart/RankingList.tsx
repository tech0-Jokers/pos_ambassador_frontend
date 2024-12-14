interface RankingListProps {
  data: { product_name: string; purchase_count: number }[];
  title: string; // タイトル
}

const RankingList: React.FC<RankingListProps> = ({ data, title }) => {
  const medals = ["🥇", "🥈", "🥉"]; // メダルのアイコン
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-bold text-center mb-4">{title}</h2>
      <ul className="space-y-2">
        {data.slice(0, 3).map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <span className="text-xl">
              {medals[index]} {item.product_name}
            </span>
            <span>{item.purchase_count} 個</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;
