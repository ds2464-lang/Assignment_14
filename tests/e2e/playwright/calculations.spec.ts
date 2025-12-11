import { test, expect } from '@playwright/test';

test.describe('Calculations BREAD Operations', () => {
  let calcId: string;

  // --------------------------------------------------
  // Login before each test
  // --------------------------------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('#login-button'); // adjust selector
    await expect(page).toHaveURL('/dashboard');
  });

  // --------------------------------------------------
  // Positive Scenarios
  // --------------------------------------------------

  test('Create a new calculation (Add)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.fill('#operand1', '5');
    await page.fill('#operand2', '3');
    await page.selectOption('#operation', 'add');
    await page.click('#submit');

    // Assert result displayed correctly
    const result = await page.locator('.calculation-result').innerText();
    expect(result).toBe('8');

    // Save calculation ID for further tests (assuming data-calc-id attribute)
    const attr = await page.locator('.calculation-item').getAttribute('data-calc-id');
    if (!attr) throw new Error('Calculation ID not found');
    calcId = attr;
  });

  test('Browse calculations', async ({ page }) => {
    await page.goto('/dashboard');
    const calculations = await page.locator('.calculation-item').count();
    expect(calculations).toBeGreaterThan(0);
  });

  test('Read a calculation', async ({ page }) => {
    await page.goto(`/dashboard/view/${calcId}`);
    const resultText = await page.locator('.calculation-result').innerText();
    expect(resultText).toBe('8');
  });

  test('Edit a calculation (PUT)', async ({ page }) => {
    await page.goto(`/dashboard/edit/${calcId}`);
    await page.fill('#operand1', '10');
    await page.fill('#operand2', '2');
    await page.selectOption('#operation', 'multiply');
    await page.click('#submit');

    const updatedResult = await page.locator('.calculation-result').innerText();
    expect(updatedResult).toBe('20');
  });

  test('Patch a calculation (partial update)', async ({ request }) => {
    const patchResponse = await request.patch(`/calculations/${calcId}`, {
      data: { inputs: [7, 3] },
    });
    expect(patchResponse.status()).toBe(200);
    const json = await patchResponse.json();
    expect(json.result).toBe(21); // if operation is still multiply
  });

  test('Delete a calculation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click(`#delete-${calcId}`); // adjust selector
    await page.on('dialog', dialog => dialog.accept()); // confirm dialog

    // Ensure item is gone
    const deletedItem = await page.locator(`.calculation-item[data-calc-id="${calcId}"]`).count();
    expect(deletedItem).toBe(0);
  });

  // --------------------------------------------------
  // Negative Scenarios
  // --------------------------------------------------

  test('Create calculation with invalid operation', async ({ request }) => {
    const response = await request.post('/calculations', {
      data: { type: 'invalid', inputs: [1, 2] },
    });
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.detail).toContain('Invalid operation');
  });

  test('Create calculation with non-numeric inputs', async ({ request }) => {
    const response = await request.post('/calculations', {
      data: { type: 'add', inputs: ['a', 'b'] },
    });
    expect(response.status()).toBe(400);
  });

  test('Access calculation of another user', async ({ request }) => {
    // Assuming this calcId belongs to a different user
    const response = await request.get(`/calculations/00000000-0000-0000-0000-000000000000`);
    expect(response.status()).toBe(404);
  });

  test('Invalid UUID format', async ({ request }) => {
    const response = await request.get('/calculations/not-a-uuid');
    expect(response.status()).toBe(400);
  });

  test('Unauthorized access', async ({ request }) => {
    const unauthenticatedRequest = await request.get('/calculations');
    expect(unauthenticatedRequest.status()).toBe(401);
  });
});
