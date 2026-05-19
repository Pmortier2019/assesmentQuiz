import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
