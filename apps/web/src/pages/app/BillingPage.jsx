import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PricingCard } from "../../components/PricingCard";
import { StatusBanner } from "../../components/StatusBanner";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { pricingPlans } from "../../lib/pricing";

export function BillingPage() {
  const { token, user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const requestedPlan = searchParams.get("plan");

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      try {
        const data = await api.billing.summary(token);
        if (!ignore) {
          setSummary(data.subscription);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    if (!requestedPlan || !summary) {
      return;
    }

    if (requestedPlan === summary.plan) {
      setMessage(`You are already on the ${requestedPlan} plan.`);
      setSearchParams({});
    }
  }, [requestedPlan, setSearchParams, summary]);

  async function handleSelectPlan(plan) {
    setMessage("");
    setError("");

    try {
      const data = await api.billing.selectPlan(token, plan);
      setSummary(data.subscription);
      updateUser({
        ...user,
        subscriptionPlan: data.subscription.plan,
        subscriptionStatus: data.subscription.status,
        trialEndsAt: data.subscription.trialEndsAt,
        features: data.subscription.features,
        role: plan === "photographer" ? "photographer" : user.role,
      });
      setMessage(`Your workspace is now on the ${plan} plan.`);
    } catch (selectError) {
      setError(selectError.message);
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading your subscription...</div>;
  }

  return (
    <div className="page-grid">
      <section className="panel hero-panel">
        <span className="eyebrow">Subscription</span>
        <h2>{summary?.plan} plan access</h2>
        <p>
          Status: {summary?.status}
          {summary?.trialEndsAt ? ` • Trial ends ${new Date(summary.trialEndsAt).toLocaleDateString()}` : ""}
        </p>
        <p>
          Choose the plan that matches your room privacy needs, upload volume, and photographer
          workflow.
        </p>
      </section>

      <StatusBanner type="success">{message}</StatusBanner>
      <StatusBanner type="error">{error}</StatusBanner>

      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <div key={plan.plan} className="pricing-action-card">
            <PricingCard {...plan} />
            <button
              className="button button--ghost"
              disabled={summary?.plan === plan.plan}
              onClick={() => handleSelectPlan(plan.plan)}
              type="button"
            >
              {summary?.plan === plan.plan ? "Current plan" : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
