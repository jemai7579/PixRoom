import { useMemo, useState } from "react";
import { Eye, ImagePlus, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api, getAssetUrl } from "../../lib/api";
import { buildAppUser } from "../../lib/mockAppData";

export function PhotographerPortfolioPage() {
  const { token, user, updateUser } = useAuth();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [coverImage, setCoverImage] = useState(appUser.portfolioImages[0] || appUser.avatar || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const portfolioImages = appUser.portfolioImages || [];

  async function savePortfolio(nextImages, nextCover = coverImage) {
    try {
      setIsSaving(true);
      setError("");
      setMessage("");
      const response = await api.users.updateProfile(token, {
        portfolioImages: nextImages,
        profilePhoto: nextCover,
      });
      updateUser(response.user);
      setCoverImage(nextCover);
      setMessage("Portfolio updated successfully.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddPortfolioImage() {
    const nextImage = portfolioInput.trim();

    if (!nextImage) {
      setError("Add an image URL or uploaded image path first.");
      return;
    }

    await savePortfolio([...portfolioImages, nextImage], coverImage || nextImage);
    setPortfolioInput("");
  }

  async function handleRemoveImage(image) {
    const nextImages = portfolioImages.filter((item) => item !== image);
    const nextCover = coverImage === image ? nextImages[0] || "" : coverImage;
    await savePortfolio(nextImages, nextCover);
  }

  async function handleSetCover(image) {
    await savePortfolio(portfolioImages, image);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_45%,#f4fbff_100%)] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
            Portfolio manager
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Curate the images that define your photographer profile, set a strong cover image, and keep your best work visible to potential clients.
          </p>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Add portfolio images</h3>
              <p className="text-sm text-slate-500">
                Paste an uploaded image path or a public image URL to expand your portfolio.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Portfolio image</span>
              <input
                className="app-field w-full"
                onChange={(event) => setPortfolioInput(event.target.value)}
                placeholder="/uploads/portfolio-hero.jpg or https://..."
                value={portfolioInput}
              />
            </label>
            <button className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} onClick={handleAddPortfolioImage} type="button">
              {isSaving ? "Saving..." : "Add portfolio image"}
            </button>
          </div>

          <div className="mt-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f3fbf8_0%,#fbfdff_100%)] p-5">
            <p className="text-sm font-semibold text-slate-900">How clients see you</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The cover image becomes the visual anchor of your photographer card in discovery, so pick a strong signature frame.
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Profile preview</h3>
              <p className="text-sm text-slate-500">A quick look at the visual identity users will notice first.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-5">
            {coverImage ? (
              <img
                alt="Portfolio cover"
                className="aspect-[4/3] w-full rounded-[24px] object-cover"
                src={getAssetUrl(coverImage)}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-slate-100 text-sm font-semibold text-slate-500">
                Add a cover image to preview your profile card
              </div>
            )}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{appUser.displayName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {appUser.location || "Location not added"} • {appUser.priceRange || "Pricing on request"}
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-700" />
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Portfolio library</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Highlight your strongest frames and keep the portfolio order intentional.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portfolioImages.length ? (
            portfolioImages.map((image) => (
              <article
                key={image}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]"
              >
                <img alt="Portfolio item" className="aspect-[4/3] w-full object-cover" src={getAssetUrl(image)} />
                <div className="space-y-3 px-4 py-4">
                  {coverImage === image ? <StatusBadge label="Cover image" status="accepted" /> : null}
                  <div className="flex flex-wrap gap-2">
                    {coverImage !== image ? (
                      <button className="app-btn-primary inline-flex h-10 items-center justify-center px-4 text-sm" disabled={isSaving} onClick={() => handleSetCover(image)} type="button">
                        Set cover image
                      </button>
                    ) : null}
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      disabled={isSaving}
                      onClick={() => handleRemoveImage(image)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-14 text-center md:col-span-2 xl:col-span-3">
              <h3 className="text-xl font-semibold text-slate-950">Your portfolio is empty</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Add a few polished event images to make your photographer profile feel alive and trustworthy.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
