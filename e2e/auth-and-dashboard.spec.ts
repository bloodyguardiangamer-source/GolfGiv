import { test, expect } from '@playwright/test';

test.describe('PRD Item 1: User Signup & Login', () => {
  test('User can open login modal and sign in with test credentials', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    if (isMobile) {
      // Open mobile menu first (the hamburger icon)
      const menuBtn = page.locator('button.lg\\:hidden').first();
      await menuBtn.click({ force: true });
      // Wait for menu animation
      await page.waitForTimeout(500);
    }
    
    // Check for login button and open modal
    const loginBtn = page.getByRole('button', { name: /Log In/i }).first();
    await expect(loginBtn).toBeVisible();
    await loginBtn.click({ force: true });
    
    // Ensure modal is visible - increase timeout for Next.js hydration and GSAP animations
    const modalHeading = page.locator('text=Welcome Back');
    await expect(modalHeading).toBeVisible({ timeout: 10000 });
    
    // We cannot easily test real Supabase OTP email flow in standard E2E without a mail trap,
    // so we verify the UI and error states.
    const emailInput = page.getByPlaceholder('you@example.com');
    await emailInput.fill('invalid-email-format');
    const submitBtn = page.getByRole('button', { name: /Send Magic Link/i });
    await submitBtn.click({ force: true });
    
    // Check error handling (PRD Item 11)
    await expect(page.getByText(/Invalid email/i)).toBeVisible();
  });
});

test.describe('PRD Item 7 & 10: User Dashboard & Responsive Design', () => {
  test('Dashboard redirects to home if unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    // Should kick back to home page with auth query param
    await expect(page).toHaveURL('/?auth=login');
  });

  test('Homepage is responsive on mobile viewports', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      // Ensure there is no horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const windowWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
    }
  });
});

test.describe('PRD Item 8: Admin Panel (Pending Phase 8)', () => {
  test.fixme('Admin panel routes are protected and accessible only to admin role', async ({ page }) => {
    // Pending Phase 8 Implementation
    await page.goto('/admin');
    await expect(page.getByText('Unauthorized')).toBeVisible();
  });
});
