"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type RegionStep = "province" | "district" | "subdistrict" | "postal";

export interface ThaiRegionValue {
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
}

interface ThaiRegionPickerProps {
  value: ThaiRegionValue;
  onChange: (value: ThaiRegionValue) => void;
  error?: string;
  className?: string;
  /** Match checkout dialog styling */
  variant?: "checkout" | "default";
}

async function fetchRegionOptions(
  level: "provinces" | "districts" | "subdistricts" | "postalcodes",
  params?: Record<string, string>,
) {
  const searchParams = new URLSearchParams({ level });
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const response = await fetch(`/api/thai-address?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch options: ${response.status}`);
  }

  const payload = (await response.json()) as { items: string[] };
  return payload.items;
}

export function ThaiRegionPicker({
  value,
  onChange,
  error,
  className,
  variant = "checkout",
}: ThaiRegionPickerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<RegionStep>("province");
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [subdistrictOptions, setSubdistrictOptions] = useState<string[]>([]);
  const [postalOptions, setPostalOptions] = useState<string[]>([]);

  const summary = [
    value.province,
    value.district,
    value.subDistrict,
    value.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const loadOptions = async (
    level: "provinces" | "districts" | "subdistricts" | "postalcodes",
    params?: Record<string, string>,
  ) => {
    setLoading(true);
    setGeoError("");
    try {
      return await fetchRegionOptions(level, params);
    } catch {
      setGeoError("โหลดข้อมูลพื้นที่ไม่สำเร็จ");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || provinceOptions.length > 0) return;
    void (async () => {
      const items = await loadOptions("provinces");
      setProvinceOptions(items);
    })();
  }, [open, provinceOptions.length]);

  const openPicker = () => {
    let nextStep: RegionStep = "province";
    if (!value.province) nextStep = "province";
    else if (!value.district) nextStep = "district";
    else if (!value.subDistrict) nextStep = "subdistrict";
    else nextStep = "postal";

    setStep(nextStep);
    setOpen(true);

    void (async () => {
      if (nextStep === "district" && value.province && districtOptions.length === 0) {
        setDistrictOptions(
          await loadOptions("districts", { province: value.province }),
        );
      }
      if (
        nextStep === "subdistrict" &&
        value.province &&
        value.district &&
        subdistrictOptions.length === 0
      ) {
        setSubdistrictOptions(
          await loadOptions("subdistricts", {
            province: value.province,
            district: value.district,
          }),
        );
      }
      if (
        nextStep === "postal" &&
        value.province &&
        value.district &&
        value.subDistrict &&
        postalOptions.length === 0
      ) {
        setPostalOptions(
          await loadOptions("postalcodes", {
            province: value.province,
            district: value.district,
            subdistrict: value.subDistrict,
          }),
        );
      }
    })();
  };

  const handleProvinceSelect = async (province: string) => {
    onChange({
      province,
      district: "",
      subDistrict: "",
      postalCode: "",
    });
    setDistrictOptions([]);
    setSubdistrictOptions([]);
    setPostalOptions([]);
    setStep("district");
    setDistrictOptions(await loadOptions("districts", { province }));
  };

  const handleDistrictSelect = async (district: string) => {
    onChange({
      ...value,
      district,
      subDistrict: "",
      postalCode: "",
    });
    setSubdistrictOptions([]);
    setPostalOptions([]);
    setStep("subdistrict");
    setSubdistrictOptions(
      await loadOptions("subdistricts", {
        province: value.province,
        district,
      }),
    );
  };

  const handleSubdistrictSelect = async (subDistrict: string) => {
    onChange({
      ...value,
      subDistrict,
      postalCode: "",
    });
    setPostalOptions([]);
    setStep("postal");
    setPostalOptions(
      await loadOptions("postalcodes", {
        province: value.province,
        district: value.district,
        subdistrict: subDistrict,
      }),
    );
  };

  const handlePostalSelect = (postalCode: string) => {
    onChange({ ...value, postalCode });
    setOpen(false);
  };

  const handleTabClick = async (next: RegionStep) => {
    setStep(next);

    if (next === "province" && provinceOptions.length === 0) {
      setProvinceOptions(await loadOptions("provinces"));
    }

    if (next === "district" && value.province && districtOptions.length === 0) {
      setDistrictOptions(
        await loadOptions("districts", { province: value.province }),
      );
    }

    if (
      next === "subdistrict" &&
      value.province &&
      value.district &&
      subdistrictOptions.length === 0
    ) {
      setSubdistrictOptions(
        await loadOptions("subdistricts", {
          province: value.province,
          district: value.district,
        }),
      );
    }

    if (
      next === "postal" &&
      value.province &&
      value.district &&
      value.subDistrict &&
      postalOptions.length === 0
    ) {
      setPostalOptions(
        await loadOptions("postalcodes", {
          province: value.province,
          district: value.district,
          subdistrict: value.subDistrict,
        }),
      );
    }
  };

  const tabs: Array<{ key: RegionStep; label: string; disabled: boolean }> = [
    { key: "province", label: "จังหวัด", disabled: false },
    { key: "district", label: "เขต/อำเภอ", disabled: !value.province },
    {
      key: "subdistrict",
      label: "แขวง/ตำบล",
      disabled: !value.district,
    },
    { key: "postal", label: "รหัสไปรษณีย์", disabled: !value.subDistrict },
  ];

  const currentOptions =
    step === "province"
      ? provinceOptions
      : step === "district"
        ? districtOptions
        : step === "subdistrict"
          ? subdistrictOptions
          : postalOptions;

  const activeTabClass =
    variant === "checkout"
      ? "border-b-2 border-destructive text-destructive"
      : "border-b-2 border-primary text-primary";

  return (
    <div className={cn("space-y-0", className)}>
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          "flex h-11 w-full items-center justify-between border bg-white px-3 text-left text-sm",
          error ? "border-red-400" : "border-slate-300",
          summary ? "text-slate-700" : "text-slate-500",
        )}
      >
        <span className="line-clamp-1">
          {summary || "จังหวัด, เขต/อำเภอ, แขวง/ตำบล, รหัสไปรษณีย์"}
        </span>
        <div className="flex items-center gap-3 text-slate-400">
          <Search className="h-4 w-4" />
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {open && (
        <div className="mt-0 overflow-hidden border border-t-0 border-slate-300">
          <div className="grid grid-cols-4 border-b border-slate-200 bg-white text-center text-sm">
            {tabs.map((tab) => {
              const active = step === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={tab.disabled}
                  onClick={() => void handleTabClick(tab.key)}
                  className={cn(
                    "px-3 py-3 font-medium transition-colors",
                    active ? activeTabClass : "text-foreground",
                    tab.disabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="max-h-64 overflow-y-auto bg-white">
            {loading ? (
              <div className="px-4 py-4 text-sm text-slate-500">
                กำลังโหลดข้อมูลพื้นที่...
              </div>
            ) : geoError ? (
              <div className="px-4 py-4 text-sm text-destructive">{geoError}</div>
            ) : currentOptions.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-500">ไม่พบข้อมูล</div>
            ) : (
              currentOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (step === "province") void handleProvinceSelect(item);
                    else if (step === "district") void handleDistrictSelect(item);
                    else if (step === "subdistrict")
                      void handleSubdistrictSelect(item);
                    else handlePostalSelect(item);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {item}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
