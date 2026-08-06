import AccessCard from "@/components/auth/AccessCard";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AccessCard initialMode="existing" />;
}
