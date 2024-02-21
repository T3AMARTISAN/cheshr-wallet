import TransactionHistoryCard from "../components/TransactionHistoryCard";

const TransactionHistory = () => {
  const receipt = JSON.parse(localStorage.getItem("dexwalletHistory"));

  return (
    <div className="container-dashboard dashboard-bg border-t-0 relative flex flex-col">
      <div className="bg-red-100 min-h-full m-5">
        <h3>Transactions</h3>
        {/* 하드코딩한 예시 */}
        <TransactionHistoryCard />
        {/* {receipt?.map((v, i) => (
          <TransactionHistoryCard
            key={i}
            from={v.from}
            to={v.to}
            value={v.value}
            chainId={v.chainId}
          />
        ))} */}
      </div>
    </div>
  );
};

export default TransactionHistory;
