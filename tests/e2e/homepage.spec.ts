import { test, expect } from '@playwright/test';

// These tests use Playwright's API request context — no browser, pure HTTP.
// The webServer config in playwright.config.ts starts the Express app automatically.

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe('ok');
});

test('calculate: add two numbers', async ({ request }) => {
  const res = await request.get('/calculate?op=add&a=10&b=5');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.result).toBe(15);
});

test('calculate: divide by zero returns 400', async ({ request }) => {
  const res = await request.get('/calculate?op=divide&a=5&b=0');
  expect(res.status()).toBe(400);
});

test('echo endpoint reflects body', async ({ request }) => {
  const res = await request.post('/echo', { data: { greeting: 'hello' } });
  const body = await res.json();
  expect(body.greeting).toBe('hello');
});
