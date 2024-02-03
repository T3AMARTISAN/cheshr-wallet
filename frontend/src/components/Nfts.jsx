import { useOutletContext } from "react-router";
import TokenCard from "./TokenCard";
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
  });
  return (
    <div className="bg-neutral-400 rounded-lg h-fit pb-10 flex flex-col">
      <div className="flex flex-row justify-between"></div>
      <div className="flex flex-row justify-between   text-neutral-200"></div>
      <ul className="grid grid-cols-3 gap-3">
        {nftData?.map((v, i) => (
          <NftCard key={i} image={v.image_url} name={v.name} />
        ))}
      </ul>
    </div>
  );
};
export default Nfts;
