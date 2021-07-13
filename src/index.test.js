import { withBrowser } from 'pleasantest';

const render = async (utils) => {
  await utils.injectHTML('<div id="root"></div>');
  await utils.loadJS('./index.js');
};

const openDialog = async (screen, user) => {
  const button = await screen.getByRole('button', { name: /open dialog/i });
  await user.click(button);
};

test(
  'Shows modal when button is pressed',
  withBrowser(async ({ utils, screen, user }) => {
    await render(utils);

    const button = await screen.getByRole('button', { name: /open dialog/i });
    await expect(
      await screen.queryByText(/I am a dialog/i)
    ).not.toBeInTheDocument();

    await user.click(button);

    await expect(await screen.queryByText(/I am a dialog/i)).toBeVisible();
  })
);

test(
  'Escape key closes modal',
  withBrowser(async ({ utils, screen, user, page }) => {
    await render(utils);
    await openDialog(screen, user);

    await expect(await screen.queryByText(/I am a dialog/i)).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(
      await screen.queryByText(/I am a dialog/i)
    ).not.toBeInTheDocument();
  })
);

test(
  'Close button closes modal',
  withBrowser(async ({ utils, screen, user }) => {
    await render(utils);
    await openDialog(screen, user);

    await expect(await screen.queryByText(/I am a dialog/i)).toBeVisible();

    const closeButton = await screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await expect(
      await screen.queryByText(/I am a dialog/i)
    ).not.toBeInTheDocument();
  })
);

test(
  'Clicking outside modal closes modal',
  withBrowser(async ({ utils, screen, user, page }) => {
    await render(utils);
    await openDialog(screen, user);

    await expect(await screen.queryByText(/I am a dialog/i)).toBeVisible();

    // (10px, 10px) should be outside the modal
    await page.mouse.click(10, 10);

    await expect(
      await screen.queryByText(/I am a dialog/i)
    ).not.toBeInTheDocument();
  })
);

test(
  'Accessibility structure of modal',
  withBrowser(async ({ utils, screen, user }) => {
    await render(utils);
    await openDialog(screen, user);
    const modal = await screen.getByRole('dialog');
    await expect(modal).toHaveAccessibleName('example dialog');
  })
);

test(
  'Focus is trapped in the modal when it opens',
  withBrowser(async ({ utils, screen, user, page }) => {
    await render(utils);
    await openDialog(screen, user);

    // When the modal is opened, the close button should be focused automatically
    const closeButton = await screen.getByRole('button', { name: /close/i });
    await expect(closeButton).toHaveFocus();

    await page.keyboard.press('Tab');
    const firstLink = await screen.getByRole('link', { name: /here/i });
    await expect(firstLink).toHaveFocus();

    await page.keyboard.press('Tab');
    const secondLink = await screen.getByRole('link', { name: /focusable/i });
    await expect(secondLink).toHaveFocus();

    // After pressing tab the third time it should cycle back to the close button,
    // instead of focusing on content that is hidden behind the modal
    await page.keyboard.press('Tab');
    await expect(closeButton).toHaveFocus();

    // Shift-tab should cycle back to the last focusable element within the modal
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    await expect(secondLink).toHaveFocus();
  })
);
