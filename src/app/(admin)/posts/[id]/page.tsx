import PostForm from "@/components/(admin)/form/PostForm";
import { redirect } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (id !== "create-post" && isNaN(Number(id))) {
    redirect("/not-found");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold pb-2 border-b-2 border-border">
        {id === "create-post" ? "Create Post" : "Edit Post"}
      </h1>
      <PostForm id={id} />
    </div>
  );
}
