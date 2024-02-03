const NftCard = ({ image, name }) => {
  return (
    <div className="p-4">
      <img className="w-28" src={image} alt={name} />
    </div>
  );
};

export default NftCard;
