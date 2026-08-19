import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
