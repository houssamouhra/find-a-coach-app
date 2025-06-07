export async function login(page, email: string, password: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /Login/i }).click();
}

export async function signup(page, email: string, password: string) {
  await page.getByRole("button", { name: /Create account/i }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /Sign up/i }).click();
}
