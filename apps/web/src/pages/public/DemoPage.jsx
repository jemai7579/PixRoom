import { Link } from "react-router-dom";
import { DemoPreview } from "../../components/DemoPreview";

export function DemoPage() {
  return (
    <main className="demo-page">
      <div className="container demo-page__content">
        <div>
          <span className="eyebrow">Demo</span>
          <h1>A preview of the PixRoom+ room experience</h1>
          <p>
            Guests upload photos, ask for missing moments, and keep the event gallery organized in one simple
            place.
          </p>
          <Link className="button button--primary" to="/register">
            Start with this experience
          </Link>
        </div>

        <DemoPreview />
      </div>
    </main>
  );
}
