import { expect, test } from "@playwright/test";

test("GET /api/banks returns 200 with valid JSON", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/banks");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty("items");
  expect(body).toHaveProperty("total");
  expect(body).toHaveProperty("page");
  expect(body).toHaveProperty("pageSize");
  expect(Array.isArray(body.items)).toBe(true);
});

test("GET /api/banks pagination params work", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/banks?page=1&pageSize=10");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.page).toBe(1);
  expect(body.pageSize).toBe(10);
});

test("GET /api/banks slug returns 404 for unknown bank", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/banks?slug=nonexistent-bank-xyz-123");
  expect(res.status()).toBe(404);
});

test("GET /api/rates returns 200 with valid JSON", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/rates");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty("items");
  expect(body).toHaveProperty("total");
});

test("GET /api/rates accepts status filter", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/rates?status=verified");
  expect(res.status()).toBe(200);
});

test("GET /api/rates pagination params work", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/rates?page=1&pageSize=20");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.pageSize).toBe(20);
});

test("GET /api/compare returns 200 with valid JSON", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/compare");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty("items");
  expect(body).toHaveProperty("total");
});

test("GET /api/compare accepts sort param", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/compare?sort=bank_asc");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.items)).toBe(true);
});

test("GET /api/compare accepts pagination params", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/compare?page=1&pageSize=10");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.pageSize).toBe(10);
});