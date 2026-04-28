import Link from "next/link";
import { getStagingJobs, getStagingRates, getStagingStats } from "@/modules/staging/data";
import { PendingRowActions, BulkActions } from "@/modules/staging/components";
import { deleteStagingRateAction, cancelCrawlJobAction, retryCrawlJobAction } from "@/modules/staging/actions";

export const metadata = { title: "Crawl Staging | Admin" };

export default async function StagingPage({
  searchParams
}: {
  searchParams?: Promise<{ job?: string; status?: string; bank?: string; page?: string; feedback?: string }>;
}) {
  await import("@/modules/auth/server/session").then((m) => m.requireAdminSession());
  const params = searchParams ? await searchParams : undefined;

  const [stats, jobs, rates] = await Promise.all([
    getStagingStats(),
    getStagingJobs(),
    getStagingRates({
      jobId: params?.job,
      status: params?.status,
      bank: params?.bank,
      page: params?.page ? Number(params.page) : 1
    })
  ]);

  const bankOptions = [...new Set(rates.items.map((r) => r.bankSlug))].sort();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Crawl Staging Review</h1>
          <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
            Review và approve/reject data từ crawler trước khi publish lên production
          </p>
        </div>
        <Link className="text-sm text-[var(--bankng-primary)]" href="/rates">
          Go to Rates CRUD
        </Link>
      </div>

      {params?.feedback === "staging_approved" && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
          ✅ Đã duyệt staging rate thành công
        </div>
      )}
      {params?.feedback === "staging_rejected" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm">
          ❌ Đã từ chối staging rate
        </div>
      )}
      {params?.feedback === "staging_bulk_approved" && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
          ✅ Đã duyệt nhiều staging rates thành công
        </div>
      )}

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="text-sm text-[var(--bankng-text-secondary)]">Pending review</div>
        </div>
        <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-sm text-[var(--bankng-text-secondary)]">Approved</div>
        </div>
        <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-[var(--bankng-text-secondary)]">Rejected</div>
        </div>
        <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
          <div className="text-2xl font-bold text-blue-600">{stats.jobsRunning}</div>
          <div className="text-sm text-[var(--bankng-text-secondary)]">Crawl jobs running</div>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
        <h2 className="mb-3 font-semibold">Crawl Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-[var(--bankng-text-secondary)]">Chưa có crawl job nào</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between border-b border-[var(--bankng-border)] pb-2">
                <div>
                  <div className="text-sm font-medium">{job.sourceUrl}</div>
                  <div className="text-xs text-[var(--bankng-text-secondary)]">
                    {job.status} · {job.pagesCrawled} pages · {job._count.stagingRates} items ·{" "}
                    {job.startedAt.toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {job.status === "running" && (
                    <form action={cancelCrawlJobAction}>
                      <input type="hidden" name="id" value={job.id} />
                      <button className="text-xs text-red-600">Cancel</button>
                    </form>
                  )}
                  {job.status === "failed" && (
                    <form action={retryCrawlJobAction}>
                      <input type="hidden" name="id" value={job.id} />
                      <button className="text-xs text-blue-600">Retry</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-[var(--bankng-border)] bg-white">
        <div className="border-b border-[var(--bankng-border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Staged Rates ({rates.total})</h2>
            <BulkActions />
          </div>
          <form className="mt-3 flex gap-3">
            <select
              name="job"
              defaultValue={params?.job ?? ""}
              className="min-h-9 rounded-md border border-[var(--bankng-border)] bg-white px-3"
            >
              <option value="">All jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.sourceUrl}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={params?.status ?? ""}
              className="min-h-9 rounded-md border border-[var(--bankng-border)] bg-white px-3"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              name="bank"
              defaultValue={params?.bank ?? ""}
              className="min-h-9 rounded-md border border-[var(--bankng-border)] bg-white px-3"
            >
              <option value="">All banks</option>
              {bankOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <button
              type="submit"
              className="min-h-9 rounded-md bg-[var(--bankng-primary)] px-4 text-white"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--bankng-surface-muted)]">
              <tr>
                <th className="px-4 py-2">
                  <input className="select-all" type="checkbox" />
                </th>
                <th className="px-4 py-2">Bank</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Variant</th>
                <th className="px-4 py-2">Rate Type</th>
                <th className="px-4 py-2">Rate</th>
                <th className="px-4 py-2">Term</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Reviewed by</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-[var(--bankng-text-secondary)]">
                    Chưa có staged rates nào
                  </td>
                </tr>
              ) : (
                rates.items.map((rate) => (
                  <tr key={rate.id} className="border-t border-[var(--bankng-border)]">
                    <td className="px-4 py-2">
                      <input
                        className="row-checkbox"
                        type="checkbox"
                        name="ids"
                        value={rate.id}
                      />
                    </td>
                    <td className="px-4 py-2">{rate.bankName}</td>
                    <td className="px-4 py-2">{rate.productName}</td>
                    <td className="px-4 py-2">{rate.variantName}</td>
                    <td className="px-4 py-2">{rate.rateType}</td>
                    <td className="px-4 py-2">
                      {rate.rateValue.toString()} {rate.rateUnit}
                    </td>
                    <td className="px-4 py-2">
                      {rate.termValue ? `${rate.termValue} ${rate.termUnit ?? ""}` : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          rate.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : rate.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {rate.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {rate.reviewedBy?.email ?? "—"}
                      {rate.reviewedAt && (
                        <div className="text-xs text-[var(--bankng-text-secondary)]">
                          {rate.reviewedAt.toLocaleDateString("vi-VN")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {rate.status === "pending" ? (
                        <PendingRowActions id={rate.id} />
                      ) : (
                        <form action={deleteStagingRateAction}>
                          <input type="hidden" name="id" value={rate.id} />
                          <button className="text-xs text-red-600">Delete</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {rates.total > rates.pageSize && (
          <div className="flex items-center justify-between border-t border-[var(--bankng-border)] px-4 py-3">
            <div className="text-sm text-[var(--bankng-text-secondary)]">
              Page {rates.page} of {Math.ceil(rates.total / rates.pageSize)}
            </div>
            <div className="flex gap-2">
              {rates.page > 1 && (
                <Link
                  href={`/staging?page=${rates.page - 1}${params?.status ? `&status=${params.status}` : ""}${params?.bank ? `&bank=${params.bank}` : ""}`}
                  className="rounded border border-[var(--bankng-border)] px-3 py-1 text-sm"
                >
                  Prev
                </Link>
              )}
              {rates.page * rates.pageSize < rates.total && (
                <Link
                  href={`/staging?page=${rates.page + 1}${params?.status ? `&status=${params.status}` : ""}${params?.bank ? `&bank=${params.bank}` : ""}`}
                  className="rounded border border-[var(--bankng-border)] px-3 py-1 text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}