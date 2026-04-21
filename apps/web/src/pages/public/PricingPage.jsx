import { Link } from "react-router-dom";
import { PricingCard } from "../../components/PricingCard";
import { SectionHeading } from "../../components/SectionHeading";
import { pricingPlans } from "../../lib/pricing";

export function PricingPage() {
  return (
    <main className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the plan that fits your event workflow"
          description="Freemium is great for simple public events. Premium unlocks private rooms and the assistant. Photographers get marketplace visibility and the special launch offer."
          align="center"
        />

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>

        <div className="page-actions page-actions--center">
          <Link className="button button--secondary" to="/">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
