const PVKey = ({ pvk, setPvk }) => {
  const handlePrivateKeyChange = (event) => {
    const _key = event.target.value.trim();
    setPvk(_key);
  };

  return (
    <div>
      <input
        className="border border-gray-300 rounded w-2/3 px-2 py-1 mt-4"
        type="password"
        value={pvk}
        placeholder="Enter your private key"
        onChange={handlePrivateKeyChange}
      />
    </div>
  );
};

export default PVKey;
