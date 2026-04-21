import { Eye, LockKeyhole } from "lucide-react";

export function DemoLockedNotice({
  message = "Preview mode is read-only. Sign up to start creating rooms and uploading photos.",
}) {
  return (
    <div className="rounded-[28px] border border-amber-200 bg-amber-50/85 px-5 py-4 text-sm text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white/80 p-2.5 text-amber-700">
          <Eye className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="font-semibold">Preview mode</p>
          <p className="mt-1 leading-6">{message}</p>
        </div>
        <LockKeyhole className="ml-auto mt-0.5 hidden h-4.5 w-4.5 text-amber-700 sm:block" />
      </div>
    </div>
  );
}
