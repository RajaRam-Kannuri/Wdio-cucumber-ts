import { Given, When, Then } from "@wdio/cucumber-framework";
import { expect } from "@wdio/globals";

/**
 * Opens the specified webpage.
 * @param {string} url - The URL of the webpage.
 */
Given(/^I open the webpage "(.*)"$/, async (url: string) => {
    await browser.url(url);
});

/**
 * Scrolls an element into view using scrollIntoView().
 * @param {string} selector - The CSS selector of the element.
 */
When(/^I scroll into view of the element "(.*)" on the "(.*)" page$/, async (selector: string, pageName: string) => {
  console.log(`Scrolling to element: ${selector} on page: ${pageName}`);
  const element = await $(selector);
  await element.scrollIntoView();
});


/**
 * Scrolls to the top of the page.
 */
When(/^I scroll to the top of the page$/, async () => {
    await browser.execute("window.scrollTo(0, 0)");
    console.log("Scrolled to the top of the page.");
});

/**
 * Scrolls to the bottom of the page.
 */
When(/^I scroll to the bottom of the page$/, async () => {
    await browser.execute("window.scrollTo(0, document.body.scrollHeight)");
    console.log("Scrolled to the bottom of the page.");
});

/**
 * Validates that an element is visible after scrolling.
 * @param {string} selector - The CSS selector of the element.
 */
Then(/^I should see the element "(.*)"$/, async (selector: string) => {
    const element = await $(selector);
    await expect(element).toBeDisplayed();
});



Feature: Scroll actions on a webpage

  Scenario: Scroll element into view
    Given I open the webpage "https://example.com"
    When I scroll into view of the element "#footer"
    Then I should see the element "#footer"

  Scenario: Scroll to the top of the page
    Given I open the webpage "https://example.com"
    When I scroll to the top of the page

  Scenario: Scroll to the bottom of the page
    Given I open the webpage "https://example.com"
    When I scroll to the bottom of the page


    When I scroll into view of the element "#terms" on the "Login" page

    When(/^I move the slider "(.*)" to "(.*)" on the "(.*)" page$/, async (selector: string, value: string, pageName: string) => {
      console.log(`Adjusting slider: ${selector} to value: ${value} on page: ${pageName}`);
  
      const slider = await $(selector);
      await slider.setValue(value);
  });

  When I move the slider "#volumeSlider" to "75" on the "Media" page

  const result: string = await browser.execute<string, WebdriverIO.Element>((el) => {
    el.scrollIntoView({ block: "center", inline: "nearest" });
    return "Done";
}, targetElement);

console.log(result); 

  https://sunlifemalaysia0-my.sharepoint.com/:u:/g/personal/harshavardhan_idamakanti_sunlifemalaysia_com/ESJ_cVvRud1FgSaF7T7en9sBTbwlPIsx0ocuB7CWYdJ3ww?e=sdGKVr