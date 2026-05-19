import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/constants/settings";

export default function RootPage() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
