import AdminPanelLayout from "@/components/(admin)/AdminPanelLayout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminPanelLayout>
      <main>{children}</main>
    </AdminPanelLayout>
  );
}
