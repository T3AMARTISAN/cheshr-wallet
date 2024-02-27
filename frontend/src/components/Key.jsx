const PVKey = ({ pvk, setPvk }) => {
  const handlePrivateKeyChange = (event) => {
    const _key = event.target.value.trim();
    setPvk(_key);
  };

  return (
    <div>
      <input
        className="inputbox w-[40vh] mx-auto"
        type="password"
        value={pvk}
        placeholder="Enter your private key"
        onChange={handlePrivateKeyChange}
      />
    </div>
  );
};

export default PVKey;
