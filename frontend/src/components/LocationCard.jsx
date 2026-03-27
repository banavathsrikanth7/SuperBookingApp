import { Link } from "react-router-dom";

function LocationCard({ location }) {
  return (
    <Link to={`/location/${location.id}`}>
      <div className="cursor-pointer bg-white rounded-2xl overflow-hidden flex flex-col">
        <div className="location-card_image-wrap">
          {location.icon_url && (
            <img
              src={location.icon_url}
              alt={location.name}
              className="aspect-[3/4] object-cover rounded-2xl mb-3"
            />
          )}
        </div>
        <h3 className="font-bold text-lg mb-4 text-gray-900 leading-snug">
          {location.name}
        </h3>
        <p className="px-1 text-gray-500">India</p>
      </div>
    </Link>
  );
}

export default LocationCard;
