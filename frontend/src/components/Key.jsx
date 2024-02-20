const PVKey = ({ setPvk }) => {
  const handlePrivateKeyChange = (event) => {
    const _key = event.target.value.trim();
    setPvk(_key);
  };

  return (
    <div>
      <input
        className="inputbox w-96 mx-auto"
        type="password"
        placeholder="Enter your private key"
        onChange={handlePrivateKeyChange}
      />
    </div>
  );
};

export default PVKey;
