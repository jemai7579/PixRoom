import { Link } from "react-router-dom";
import pixroomLogo from "../assets/pixroom-logo.png";

export function PixroomLogo({
  centered = false,
  className = "",
  imageClassName = "",
  onClick,
  subtitle = "",
  to = "/",
}) {
  const alignmentClass = centered ? "items-center text-center" : "items-start text-left";

  const content = (
    <div className={["inline-flex flex-col gap-1.5", alignmentClass, className].join(" ").trim()}>
      <img
        alt="PixRoom+"
        className={["h-auto w-full max-w-[120px] object-contain", imageClassName].join(" ").trim()}
        src={pixroomLogo}
      />
      {subtitle ? <p className="text-[11px] leading-4 text-slate-500">{subtitle}</p> : null}
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link className="inline-flex" onClick={onClick} to={to}>
      {content}
    </Link>
  );
}
