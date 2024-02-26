const TransactionHistoryCard = ({ to, value, time, type }) => {
  return (
    <div className="token-container">
      <div className="grow flex justify-between text-lg">
        <div className="flex flex-col items-start pl-2">
          {/* 받는 주소 */}
          <div className="dm-sans-token-info">
            {to.substring(0, 5)}...
            {to.substring(to.length - 4)}
          </div>

          {/* 거래 유형 및 날짜 */}
          <div className="flex items-center dm-sans-body-feed text-base">
            <span className="dm-sans-body-feed text-base">{type}</span>
            <div class="mx-2 w-1 h-1 bg-neutral-900 rounded-full"></div>
            <span className="dm-sans-body-feed text-base">{time}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          {/*거래 금액 USD 환산가치*/}
          {/* <div className="dm-sans-token-info">{value}</div> */}
          <div className="dm-sans-token-info">-US$0.47</div>
          {/*거래 개수*/}
          <div className="dm-sans-body-feed text-base">
            {value.substring(0, 5)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionHistoryCard;
