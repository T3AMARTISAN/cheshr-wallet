const NftCard = ({ image, name, url }) => {
  return (
    <div className="p-4">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img className="w-28" src={image} alt={name} />
      </a>
    </div>
  );
};

export default NftCard;
