"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toSlug } from "@bankng/shared-utils";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseBooleanField, parseOptionalStringField } from "../shared/server/form-values";

function revalidateArticles() {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/tin-tuc");
}

// ─── Article Categories ────────────────────────────────────────────────────

export async function createArticleCategoryAction(formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get("name")).trim();
  const slugInput = parseOptionalStringField(formData.get("slug"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name) redirect(buildFeedbackPath("/articles", "category_name_required"));

  const slug = slugInput || toSlug(name);

  const category = await prisma.articleCategory.create({
    data: { name, slug, sortOrder },
  });

  await recordAuditLog({
    entityType: "article_category",
    entityId: category.id,
    action: "create",
    metadata: { name: category.name },
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_category_created"));
}

export async function updateArticleCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  const name = String(formData.get("name")).trim();
  const slug = String(formData.get("slug")).trim() || toSlug(name);
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  const category = await prisma.articleCategory.update({
    where: { id },
    data: { name, slug, sortOrder },
  });

  await recordAuditLog({
    entityType: "article_category",
    entityId: id,
    action: "update",
    metadata: { name: category.name },
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_category_updated"));
}

export async function deleteArticleCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.articleCategory.delete({ where: { id } });
  await recordAuditLog({
    entityType: "article_category",
    entityId: id,
    action: "delete",
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_category_deleted"));
}

// ─── Articles ──────────────────────────────────────────────────────────────

export async function createArticleAction(formData: FormData) {
  await requireAdminSession();
  const title = String(formData.get("title")).trim();
  const slugInput = parseOptionalStringField(formData.get("slug"));
  const excerpt = parseOptionalStringField(formData.get("excerpt"));
  const content = String(formData.get("content")).trim();
  const categoryId = String(formData.get("categoryId"));
  const authorName = parseOptionalStringField(formData.get("authorName"));
  const readTimeMin = formData.get("readTimeMin") ? Number(formData.get("readTimeMin")) : null;
  const coverImage = parseOptionalStringField(formData.get("coverImage"));
  const status = (String(formData.get("status")) || "draft") as "draft" | "active" | "archived";
  const isFeatured = parseBooleanField(formData.get("isFeatured"));

  if (!title || !content || !categoryId) {
    redirect(buildFeedbackPath("/articles", "article_missing_fields"));
  }

  const slug = slugInput || toSlug(title);

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      authorName,
      readTimeMin,
      coverImage,
      status,
      isFeatured,
    },
  });

  await recordAuditLog({
    entityType: "article",
    entityId: article.id,
    action: "create",
    metadata: { title: article.title, status: article.status },
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_created"));
}

export async function updateArticleAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  const title = String(formData.get("title")).trim();
  const slug = String(formData.get("slug")).trim() || toSlug(title);
  const excerpt = parseOptionalStringField(formData.get("excerpt"));
  const content = String(formData.get("content")).trim();
  const categoryId = String(formData.get("categoryId"));
  const authorName = parseOptionalStringField(formData.get("authorName"));
  const readTimeMin = formData.get("readTimeMin") ? Number(formData.get("readTimeMin")) : null;
  const coverImage = parseOptionalStringField(formData.get("coverImage"));
  const status = (String(formData.get("status")) || "draft") as "draft" | "active" | "archived";
  const isFeatured = parseBooleanField(formData.get("isFeatured"));

  const article = await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      authorName,
      readTimeMin,
      coverImage,
      status,
      isFeatured,
    },
  });

  await recordAuditLog({
    entityType: "article",
    entityId: id,
    action: "update",
    metadata: { title: article.title, status: article.status },
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_updated"));
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.article.delete({ where: { id } });
  await recordAuditLog({
    entityType: "article",
    entityId: id,
    action: "delete",
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_deleted"));
}

export async function publishArticleAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.article.update({ where: { id }, data: { status: "active" } });
  await recordAuditLog({
    entityType: "article",
    entityId: id,
    action: "publish",
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_published"));
}

export async function unpublishArticleAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.article.update({ where: { id }, data: { status: "draft" } });
  await recordAuditLog({
    entityType: "article",
    entityId: id,
    action: "unpublish",
  });

  revalidateArticles();
  redirect(buildFeedbackPath("/articles", "article_unpublished"));
}
