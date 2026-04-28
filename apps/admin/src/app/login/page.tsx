import { loginAdminAction } from "@/modules/auth/actions";
import { Badge, Button, Card, Input } from "@bankng/ui";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "invalid_credentials";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bankng-background)] px-6 py-10">
      <Card className="w-full max-w-md" title="Admin Login">
        <Badge>Protected area</Badge>
        <p className="mt-3 text-sm text-[var(--bankng-text-secondary)]">
          Dang nhap de truy cap backoffice catalog, rates va audit logs.
        </p>
        {hasError ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Sai email hoac mat khau admin.
          </p>
        ) : null}
        <form action={loginAdminAction} className="mt-5 grid gap-4">
          <Input defaultValue="admin@bankng.local" label="Admin email" name="email" type="email" />
          <Input label="Admin password" name="password" type="password" />
          <Button type="submit">Dang nhap admin</Button>
        </form>
      </Card>
    </main>
  );
}
