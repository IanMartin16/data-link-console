import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = { title: "Create your key" };

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
