describe("Login Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should login successfully", async () => {
    await element(by.id("usernameInput")).typeText("emilys");
    await element(by.id("passwordInput")).typeText("emilyspass");

    await element(by.id("loginButton")).tap();

    await expect(element(by.text("Home"))).toBeVisible();
  });
});