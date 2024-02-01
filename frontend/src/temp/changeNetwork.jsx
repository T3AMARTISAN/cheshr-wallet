const Select = () => {
  const infuraApiKey = process.env.REACT_APP_INFURA_API_KEY;

  const providerEth = `wss://goerli.infura.io/ws/v3/${infuraApiKey}`;
  const providerEthGoerli = `wss://goerli.infura.io/ws/v3/${infuraApiKey}`;
  const providerEthSepolia = `wss://sepolia.infura.io/ws/v3/${infuraApiKey}`;
  const providerLinea = `wss://linea-mainnet.infura.io/ws/v3/${infuraApiKey}`;
  const providerPolygon = `wss://polygon-mainnet.infura.io/ws/v3/${infuraApiKey}`;

  // The following networks do not currently offer websocket endpoints.
  const providerOptimism = `https://optimism-mainnet.infura.io/v3/${infuraApiKey}`;
  const providerArbitrum = `https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`;
  const providerAvalanche = `https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`;

  return;
};

export default Select;
