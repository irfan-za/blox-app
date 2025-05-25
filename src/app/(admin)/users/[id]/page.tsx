import UserForm from "@/components/(admin)/form/UserForm";
import { redirect } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (id !== "create-user" && isNaN(Number(id))) {
    redirect("/not-found");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold pb-2 border-b-2 border-border">
        {id === "create-user" ? "Create User" : "Edit User"}
      </h1>
      <UserForm id={id} />
    </div>
  );
}
