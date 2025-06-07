export async function registerAsCoach(page, coach) {
  await page.getByLabel("First name").fill(coach.firstName);
  await page.getByLabel("Last name").fill(coach.lastName);
  await page.getByLabel("Description").fill(coach.description);
  await page.getByLabel("Hourly Rate").fill(coach.hourlyRate);

  for (const skill of coach.specialties) {
    await page.getByText(skill).click();
  }

  await page.getByRole("button", { name: /register/i }).click();
}
