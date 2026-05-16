import "../styles/CategoryCard.css";
import { Link } from "react-router-dom";
function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.id}`} className="category-card">
      <div className="category-card__image-wrap">
        {category.icon_url && (
          <img
            src={category.icon_url}
            alt={category.name}
            className="category-card__image"
          />
        )}
      </div>
      <h3 className="category-card__title">{category.name}</h3>
    </Link>
  );
}

export default CategoryCard;
