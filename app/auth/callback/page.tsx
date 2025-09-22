import { redirect } from "next/navigation";

const Page = async (props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  const { next, status } = searchParams as { [key: string]: string };

  if (status === "authenticated") {
    if (next) {
      redirect(next);
    }
  }
  redirect("/");
};

export default Page;
