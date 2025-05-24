import AdminPanelLayout from "@/components/(admin)/AdminPanelLayout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminPanelLayout>
      <main className="border-2 border-red-500">{children}</main>
    </AdminPanelLayout>
  );
}
