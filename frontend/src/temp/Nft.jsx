import { useEffect } from "react";

const Nft = () => {
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "07b7f83527fb499cbd5248fcaace6f44",
      },
    };

    fetch(
      "https://api.opensea.io/api/v2/chain/matic/account/0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382/nfts",
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  });

  return <div>hello</div>;
};

export default Nft;
