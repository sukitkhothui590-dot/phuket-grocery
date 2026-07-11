import { COD_FEE, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";

export type FeeKind =
  | "shipping_standard"
  | "shipping_express"
  | "cod"
  | "product"
  | "discount";

export interface SystemFeeItem {
  id: FeeKind;
  title: string;
  amountLabel: string;
  amount: number;
  description: string;
  condition?: string;
  isCharge: boolean;
}

export interface SystemFeesSummary {
  shippingStandard: number;
  shippingExpress: number;
  freeShippingThreshold: number;
  codFee: number;
  items: SystemFeeItem[];
}

export async function getSystemFees(): Promise<SystemFeesSummary> {
  const settings = await getStoreSettings();

  const shippingStandard = settings.shippingCostStandard || SHIPPING_COST.standard;
  const shippingExpress = settings.shippingCostExpress || SHIPPING_COST.express;
  const freeShippingThreshold =
    settings.freeShippingThreshold || FREE_SHIPPING_THRESHOLD;
  const codFee = settings.codFee ?? COD_FEE;

  const items: SystemFeeItem[] = [
    {
      id: "product",
      title: "ราคาสินค้า",
      amountLabel: "ตามราคาที่แสดง",
      amount: 0,
      description: "ราคาสินค้าบนเว็บรวม VAT แล้ว ไม่มีบวกเพิ่มตอนคิดเงิน",
      isCharge: true,
    },
    {
      id: "shipping_standard",
      title: "ค่าจัดส่งมาตรฐาน",
      amountLabel: `฿${shippingStandard.toLocaleString()}`,
      amount: shippingStandard,
      description: "จัดส่งปกติทั่วภูเก็ต ใช้เวลาประมาณ 1–2 วันทำการ",
      condition: `ฟรีเมื่อยอดสั่งซื้อครบ ฿${freeShippingThreshold.toLocaleString()}`,
      isCharge: true,
    },
    {
      id: "shipping_express",
      title: "ค่าจัดส่งด่วน",
      amountLabel: `฿${shippingExpress.toLocaleString()}`,
      amount: shippingExpress,
      description: "จัดส่งด่วน วันนี้–พรุ่งนี้ (ขึ้นกับพื้นที่และรอบรถ)",
      condition: `ฟรีเมื่อยอดสั่งซื้อครบ ฿${freeShippingThreshold.toLocaleString()}`,
      isCharge: true,
    },
    {
      id: "cod",
      title: "ค่าธรรมเนียมเก็บเงินปลายทาง (COD)",
      amountLabel:
        codFee > 0 ? `฿${codFee.toLocaleString()}` : "ไม่มีค่าธรรมเนียม",
      amount: codFee,
      description: "คิดเพิ่มเมื่อเลือกชำระเงินสดตอนรับสินค้า",
      condition: codFee > 0 ? "ต่อ 1 คำสั่งซื้อ" : "โอนเงินไม่มีค่าธรรมเนียมนี้",
      isCharge: codFee > 0,
    },
    {
      id: "discount",
      title: "ส่วนลด / คูปอง",
      amountLabel: "ตามโค้ดที่ใช้",
      amount: 0,
      description: "หักจากยอดรวมเมื่อใช้คูปองที่เก็บไว้หรือใส่โค้ดตอนชำระเงิน",
      isCharge: false,
    },
  ];

  return {
    shippingStandard,
    shippingExpress,
    freeShippingThreshold,
    codFee,
    items,
  };
}
