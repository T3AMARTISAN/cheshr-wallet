const LpPoolCard = () => {
  return (
    <div className="bg-neutral-400 roundBlock flex flex-col my-6">
      <div className="flex flex-row justify-between m-4">
        <div>UNISWAP POOL</div>
        <div>See Profit</div>
      </div>
      <div className="flex flex-row justify-between mx-4 text-neutral-200">
        <div>PROVIDED</div>
        <div>AMOUNT</div>
        <div>USD</div>
      </div>
      <div className="flex flex-row justify-between mx-4 text-neutral-50">
        <div>MATIC</div>
        <div>39</div>
        <div>$29.10</div>
      </div>
      <div className="flex flex-row justify-between mx-4  text-neutral-50">
        <div>USDT</div>
        <div>19</div>
        <div>$19.48</div>
      </div>
    </div>
  );
};

export default LpPoolCard;
