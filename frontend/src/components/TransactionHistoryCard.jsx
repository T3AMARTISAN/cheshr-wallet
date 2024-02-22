import { ethers } from "ethers";

// @TODO
const TransactionHistoryCard = ({ from, to, value, type, ticker, time }) => {
  return (
    <div className="bg-green-100 my-3 flex justify-between items-center">
      <div className="bg-yello-100">
        <ul>{type}</ul>
        <ul>{from}</ul>
        <ul>{to}</ul>
        <ul>{ticker}</ul>
        <ul>{time}</ul>
      </div>
      <div className="bg-gray-100">{value}</div>
    </div>
  );
};

export default TransactionHistoryCard;
