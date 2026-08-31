"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import { STORE_BRANCHES } from "@/lib/store-branches";

interface StoreBranchListProps {
  phone: string;
}

function BranchImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center bg-slate-100 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <Store className="h-7 w-7" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">รูปสาขา</p>
      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function BranchImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <BranchImagePlaceholder label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[16/10] w-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function StoreBranchList({ phone }: StoreBranchListProps) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">จังหวัดภูเก็ต</h2>
      <div className="mt-3 border-b-4 border-gray-900" />

      <ul className="mt-10 space-y-12">
        {STORE_BRANCHES.map((branch) => (
          <li
            key={branch.id}
            className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start"
          >
            <div className="overflow-hidden bg-gray-100">
              {branch.image ? (
                <BranchImage src={branch.image} alt={branch.name} />
              ) : (
                <BranchImagePlaceholder label={branch.name} />
              )}
            </div>

            <div className="min-w-0 pt-1">
              <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                {branch.name}
              </h3>

              <dl className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700 sm:text-base">
                <div>
                  <dt className="inline font-semibold text-gray-900">ที่อยู่: </dt>
                  <dd className="inline">{branch.address}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-gray-900">โทร: </dt>
                  <dd className="inline">
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-primary"
                    >
                      {phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-gray-900">เวลาทำการ: </dt>
                  <dd className="inline">{branch.workingHours}</dd>
                </div>
              </dl>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium text-gray-900 underline underline-offset-4 transition-colors hover:text-primary sm:text-base"
              >
                แผนที่และเส้นทาง &gt;
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
