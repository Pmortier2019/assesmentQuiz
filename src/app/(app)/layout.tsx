import { AuthGuard } from "@/components/auth/AuthGuard";
import { CommandPalette } from "@/components/layout/CommandPalette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
      <CommandPalette />
    </AuthGuard>
  );
}
