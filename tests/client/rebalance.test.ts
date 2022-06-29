import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const RebalanceCommand = commands.find(n => n.value === 'Rebalance');

test.describe('Test the Rebalance command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Rebalance command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Rebalance');
    await expect(page).toHaveTitle('Rebalance');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${RebalanceCommand?.flags?.in_through}`, 'carol');
    await page.type(`#${RebalanceCommand?.flags?.out_through}`, 'bob');
    await page.type(`#${RebalanceCommand?.flags?.max_rebalance}`, '50000');
    await page.type(`#${RebalanceCommand?.flags?.timeout_minutes}`, '1');
    await page.type('#node', 'alice');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Rebalance Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#rebalanceResult')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});