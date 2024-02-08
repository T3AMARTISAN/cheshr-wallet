import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const TransactionHistoryCard = ({ from, to, value, chainId }) => {
  const { currentAccount } = useOutletContext();

  const [type, setType] = useState("");
  useEffect(() => {
    if (currentAccount == from) {
      setType("Sent");
    }
    if (currentAccount == to) {
      setType("Received");
    }
  });

  return (
    <div className="bg-green-100 my-3 flex justify-between items-center">
      <div className="bg-yello-100">
        <ul>{type}</ul>
        <ul>from : {from}</ul>
      </div>
      <div className="bg-gray-100">{value}</div>
    </div>
  );
};

export default TransactionHistoryCard;
