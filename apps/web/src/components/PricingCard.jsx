import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PricingCard({ name, price, period, description, features, ctaLabel, plan, featured }) {
  const { isAuthenticated } = useAuth();
  const target = isAuthenticated ? `/app/billing?plan=${plan}` : `/register?plan=${plan}`;

  return (
    <article className={`pricing-card ${featured ? "pricing-card--featured" : ""}`}>
      <div className="pricing-card__header">
        <span className="pricing-card__name">{name}</span>
        <div className="pricing-card__price">
          <strong>{price}</strong>
          <span>{period}</span>
        </div>
        <p>{description}</p>
      </div>

      <ul className="pricing-card__list">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <Link className={`button ${featured ? "button--primary" : "button--secondary"}`} to={target}>
        {ctaLabel}
      </Link>
    </article>
  );
}
