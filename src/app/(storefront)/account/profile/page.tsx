"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Address } from "@/types";
import { User, MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const addressSchema = z.object({
  label: z.string().min(1, "กรุณาตั้งชื่อที่อยู่"),
  fullName: z.string().min(1, "กรุณากรอกชื่อผู้รับ"),
  phone: z.string().min(9, "เบอร์โทรไม่ถูกต้อง"),
  addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
  addressLine2: z.string().optional(),
  district: z.string().min(1, "กรุณากรอกอำเภอ/เขต"),
  subDistrict: z.string().min(1, "กรุณากรอกตำบล/แขวง"),
  province: z.string().min(1, "กรุณากรอกจังหวัด"),
  postalCode: z.string().min(5, "รหัสไปรษณีย์ไม่ถูกต้อง"),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  const handleProfileSubmit = (data: ProfileFormData) => {
    updateUser(data);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const openAddressDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      addressForm.reset({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        district: address.district,
        subDistrict: address.subDistrict,
        province: address.province,
        postalCode: address.postalCode,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      addressForm.reset({
        label: "",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        district: "",
        subDistrict: "",
        province: "ภูเก็ต",
        postalCode: "",
        isDefault: false,
      });
    }
    setAddressDialogOpen(true);
  };

  const handleAddressSave = (data: AddressFormData) => {
    if (editingAddress) {
      const updated = user.addresses.map((a) =>
        a.id === editingAddress.id ? { ...a, ...data } : a
      );
      updateUser({ addresses: updated });
    } else {
      const newAddr: Address = {
        ...data,
        id: `addr-${Date.now()}`,
        addressLine2: data.addressLine2 || undefined,
        isDefault: data.isDefault || false,
      };
      updateUser({ addresses: [...user.addresses, newAddr] });
    }
    setAddressDialogOpen(false);
  };

  const handleDeleteAddress = (addrId: string) => {
    updateUser({
      addresses: user.addresses.filter((a) => a.id !== addrId),
    });
  };

  const handleSetDefault = (addrId: string) => {
    updateUser({
      addresses: user.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addrId,
      })),
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">แก้ไขข้อมูลส่วนตัว</h1>

      {/* Profile form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            ข้อมูลส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input
                  id="firstName"
                  {...profileForm.register("firstName")}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input
                  id="lastName"
                  {...profileForm.register("lastName")}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  {...profileForm.register("phone")}
                />
                {profileForm.formState.errors.phone && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit">บันทึกข้อมูล</Button>
              {profileSaved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <Check className="size-4" />
                  บันทึกเรียบร้อยแล้ว
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Address list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            ที่อยู่จัดส่ง
          </CardTitle>
          <CardAction>
            <Button size="sm" onClick={() => openAddressDialog()}>
              <Plus className="size-4" />
              เพิ่มที่อยู่
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {user.addresses.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              ยังไม่มีที่อยู่ กรุณาเพิ่มที่อยู่จัดส่ง
            </p>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{addr.label}</span>
                        {addr.isDefault && (
                          <Badge variant="secondary">ค่าเริ่มต้น</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm">
                        {addr.fullName} | {addr.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.addressLine1}
                        {addr.addressLine2 &&
                          `, ${addr.addressLine2}`},{" "}
                        {addr.subDistrict}, {addr.district},{" "}
                        {addr.province} {addr.postalCode}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!addr.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleSetDefault(addr.id)}
                          title="ตั้งเป็นค่าเริ่มต้น"
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openAddressDialog(addr)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address dialog */}
      <Dialog
        open={addressDialogOpen}
        onOpenChange={(open) => setAddressDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={addressForm.handleSubmit(handleAddressSave)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>ชื่อที่อยู่</Label>
                <Input
                  placeholder="เช่น บ้าน, ร้านค้า"
                  {...addressForm.register("label")}
                />
                {addressForm.formState.errors.label && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.label.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>ชื่อผู้รับ</Label>
                <Input
                  placeholder="ชื่อ-นามสกุล"
                  {...addressForm.register("fullName")}
                />
                {addressForm.formState.errors.fullName && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label>เบอร์โทร</Label>
              <Input
                placeholder="0xx-xxx-xxxx"
                {...addressForm.register("phone")}
              />
              {addressForm.formState.errors.phone && (
                <p className="text-xs text-red-500">
                  {addressForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>ที่อยู่</Label>
              <Input
                placeholder="บ้านเลขที่ ถนน ซอย"
                {...addressForm.register("addressLine1")}
              />
              {addressForm.formState.errors.addressLine1 && (
                <p className="text-xs text-red-500">
                  {addressForm.formState.errors.addressLine1.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>ที่อยู่เพิ่มเติม (ถ้ามี)</Label>
              <Input
                placeholder="อาคาร ชั้น ห้อง"
                {...addressForm.register("addressLine2")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>ตำบล/แขวง</Label>
                <Input {...addressForm.register("subDistrict")} />
                {addressForm.formState.errors.subDistrict && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.subDistrict.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>อำเภอ/เขต</Label>
                <Input {...addressForm.register("district")} />
                {addressForm.formState.errors.district && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.district.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>จังหวัด</Label>
                <Input {...addressForm.register("province")} />
                {addressForm.formState.errors.province && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.province.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>รหัสไปรษณีย์</Label>
                <Input {...addressForm.register("postalCode")} />
                {addressForm.formState.errors.postalCode && (
                  <p className="text-xs text-red-500">
                    {addressForm.formState.errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingAddress ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มที่อยู่"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
