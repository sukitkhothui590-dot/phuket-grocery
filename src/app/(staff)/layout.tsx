export default function StaffLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#f4f9f9]">{children}</div>;
}
