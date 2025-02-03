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
When(/^I scroll into view of the element "(.*)"$/, async (selector: string) => {
    const element = await $(selector);
    await element.scrollIntoView();
    console.log(`Scrolled into view: ${selector}`);
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
