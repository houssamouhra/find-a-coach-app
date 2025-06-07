import { test, expect } from "@playwright/test";
import { login, signup } from "./utils/auth";
import { registerAsCoach } from "./utils/registerCoach";

test("Clicks link to home and auto-redirects to /coaches", async ({ page }) => {
  // Go to a page
  await page.goto("https://find-a-coach-houssam.netlify.app/");

  // Wait for the redirect to happen to /coaches
  await page.waitForURL("**/coaches");

  // Assert that the redirect happened
  expect(page.url()).toBe("https://find-a-coach-houssam.netlify.app/coaches");

  // Expect to have a heading element with the text "Find a Coach"
  await expect(page.getByRole("link", { name: "Find a Coach" })).toBeVisible();
});

// prettier-ignore
test("Check if the heading is visible on the /coaches page", async ({ page }) => {
  // navigate to the "/coaches" route
  await page.goto("https://find-a-coach-houssam.netlify.app/coaches");

  // Look for a heading element with text "Find Your Coach"
  // prettier-ignore
  await expect(page.getByRole("heading", { name: "Find Your Coach" })).toBeVisible();
});

test("Click Login link and redirect to /auth", async ({ page }) => {
  // navigate to the "/coaches" route
  await page.goto("https://find-a-coach-houssam.netlify.app/coaches");

  // Click to 'Login' link
  await page.getByRole("link", { name: /^Login$/ }).click();

  // Redirect to '/auth' page
  await page.waitForURL("**/auth");

  // Expect to have a heading element with the text "Login"
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("Check if a user is registered", async ({ page }) => {
  // Go to /auth (login page)
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  // Fill in an empty email and/or passworld
  await page.getByLabel("Email").fill("");
  await page.getByLabel("Password").fill("");

  // Click Login
  await page.getByRole("button", { name: "Login" }).click();

  expect(page.getByText("Please enter a valid email address."));
  // prettier-ignore
  expect(page.getByText(/min 8 characters/i));

  // Fill in a correct email and/or password
  await login(page, "test@example.com", "test2020!");

  // Redirect to /coaches
  await page.waitForURL("**/coaches");

  await expect(page).toHaveURL(/\/coaches$/);
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});

test("Shows error on invalid login", async ({ page }) => {
  // Go to /auth (login page)
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  // Fill in an empty email and/or passworld
  await login(page, "", "");

  // Expect field validation messages
  expect(page.getByText("Please enter a valid email address."));
  // prettier-ignore
  await expect(page.getByText(/min 8 characters/i)).toBeVisible();

  //  Fill in a wrong email and/or password
  await login(page, "test@example.com", "test123$");

  // prettier-ignore
  await expect(page.getByText("Failed to authenticate.")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();

  // Check the URL did NOT change to /coaches and still on /auth
  expect(page.url()).not.toContain("/coaches");
  expect(page.url()).toContain("/auth");
});

test("Signup fails with an empty input fields", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  // Fill in an empty email and/or passworld
  await signup(page, "", "");

  // // Click to Signup
  // await page.getByRole("button", { name: "Sign up" }).click();

  // Expect field validation message
  await expect(page.getByText(/min 8 characters/i)).toBeVisible();
});

test("Signup fails with already existing account", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  // Fill in an already exicted email and/or password
  await signup(page, "test@example.com", "test2020!");

  // prettier-ignore
  // Expect error message (wait for it to appear)
  await expect(page.getByRole("heading", { name: "An Error occurred" })).toBeVisible();

  // Close the error message
  await page.getByRole("button", { name: "Close" }).click();
});

test("User can sign up and gets redirected", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  // Sign-up with a Unique new User
  const email = `user${Date.now()}@test.com`;
  const password = "strongPassword123!";
  await signup(page, email, password);

  // Waiting for the page to redirect
  await page.waitForURL("**/coaches");

  // Check the link and expect it to be /coaches
  // prettier-ignore
  await expect(page).toHaveURL(/\/coaches/);

  // Expect "Logout" button to show up
  // prettier-ignore
  await expect(page.getByRole("button", { name:'Logout' })).toBeVisible();
});

test("Redirect to /register if you are loged in ", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  const email = `user${Date.now()}@test.com`;
  const password = "strongPassword123!";
  await signup(page, email, password);

  // Waiting for the page to redirect
  await page.waitForURL("**/coaches");

  // Check the link and expect it to be /coaches
  // prettier-ignore
  await expect(page).toHaveURL(/\/coaches/);

  // Check and Click to register as a coach inside /coaches
  await expect(
    page.getByRole("link", { name: "Register as Coach" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Register as Coach" }).click();

  await page.waitForURL("**/register");
  await expect(page).toHaveURL(/\/register/);
});

test("Register as a Coach", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/register");

  await expect(page).toHaveURL(/\/auth/);

  const email = `user${Date.now()}@test.com`;
  const password = "strongPassword123!";
  await signup(page, email, password);

  // Waiting for the page to redirect
  await page.waitForURL("**/coaches");

  // Check the link and expect it to be /coaches
  // prettier-ignore
  await expect(page).toHaveURL(/\/coaches/);

  // Check and Click to register as a coach inside /coaches
  await page.getByRole("link", { name: "Register as Coach" }).click();

  await expect(
    page.getByRole("heading", { name: "Register as a coach now!" })
  ).toBeVisible();

  // Fill all the input fields
  const coachData = {
    firstName: `Playwright ${Date.now()}`,
    lastName: "Test",
    description: "This is a test!",
    hourlyRate: "12",
    specialties: ["Frontend Development", "Backend Development"],
  };
  await registerAsCoach(page, coachData);

  await page.waitForURL("**/coaches");
  await expect(page).toHaveURL(/\/coaches/);

  await expect(
    page.getByRole("heading", {
      name: `${coachData.firstName} ${coachData.lastName}`,
    })
  ).toBeVisible();
});

test("Click to logout the user", async ({ page }) => {
  await page.goto("https://find-a-coach-houssam.netlify.app/auth");

  await login(page, "test@example.com", "test2020!");

  await page.waitForURL("**/coaches");

  await expect(page).toHaveURL(/\/coaches/);
  // Check if the Logout button is visible
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page.getByRole("button", { name: "Logout" })).toHaveCount(0);
});
