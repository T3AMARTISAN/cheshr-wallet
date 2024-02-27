import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import NftCard from "./NftCard";

const Nfts = () => {
  const { chainName } = useOutletContext();
  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "07b7f83527fb499cbd5248fcaace6f44",
      },
    };

    fetch(
      `https://api.opensea.io/api/v2/chain/${chainName}/account/${process.env.REACT_APP_TEST_ACCOUNT}/nfts`,
      options
    )
      .then((response) => response.json())
      .then((response) => setNftData(response.nfts))
      .catch((err) => console.error(err));
  }, [chainName]);

  return (
    <div className="container-dashboard dashboard-feed-bg relative flex flex-col p-4">
      <div className="flex-grow overflow-auto">
        <div className="dm-sans font-medium text-xl text-white py-4 mx-8">
          NFT
        </div>

        <ul className="grid grid-cols-3 gap-3">
          {nftData?.map((v, i) => (
            <NftCard
              key={i}
              image={v.image_url}
              name={v.name}
              url={v.opensea_url}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Nfts;
