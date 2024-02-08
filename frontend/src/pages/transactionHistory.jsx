import TransactionHistoryCard from "../components/TransactionHistoryCard";

const TransactionHistory = () => {
  const receipt = JSON.parse(localStorage.getItem("history"));

  return (
    <div className="container overflow-y-auto bg-blue-100">
      <div className="bg-red-100 min-h-full m-5">
        <h3>Transactions</h3>
        {receipt?.map((v, i) => (
          <TransactionHistoryCard
            key={i}
            from={v.from}
            to={v.to}
            value={v.value}
            chainId={v.chainId}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
