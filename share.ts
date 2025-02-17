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


import { AfterStep } from '@cucumber/cucumber';
import { browser } from '@wdio/globals';
import { allure } from 'allure-mocha/runtime';

AfterStep(async function (step, scenario) {
    if (scenario.result?.status === 'failed') {
        const errorMessage = scenario.result?.message || 'Unknown error';
        let screenshot;
        let locator = null;

        allure.startStep(`Step Failed: ${step.pickleStep.text}`);

        // ✅ Identify error type and set status accordingly
        if (errorMessage.includes('no such element') || errorMessage.includes('element could not be located')) {
            allure.setStatus('broken');  // ⚠️ Broken for missing elements
        } else if (errorMessage.includes('timeout') || errorMessage.includes('stale element')) {
            allure.setStatus('broken');  // ⚠️ Broken for timeout & stale element issues
        } else if (errorMessage.includes('assertion') || errorMessage.includes('expected')) {
            allure.setStatus('failed');  // ❌ Failed for assertion errors
        } else {
            allure.setStatus('broken');  // ⚠️ Default to broken for unknown WebDriver issues
        }

        // ✅ Extract locator from error message
        const locatorMatch = errorMessage.match(/element\["(.*?)"\]/);
        if (locatorMatch) {
            locator = locatorMatch[1];

            try {
                const element = await $(locator);
                // ✅ Highlight element if it exists in the DOM
                await browser.execute("arguments[0].style.border='3px solid red'", element);
            } catch (highlightError) {
                console.warn("Unable to highlight missing element:", highlightError.message);
            }
        }

        // ✅ Capture Screenshot
        screenshot = await browser.takeScreenshot();
        allure.addAttachment('Highlighted Screenshot', screenshot, 'image/png');

        allure.endStep();
    }
});


import { AfterStep } from '@cucumber/cucumber';
import { browser } from '@wdio/globals';
import { allure } from 'allure-mocha/runtime';
import { attachScreenshot, highlightElement } from '../utils/allureUtils';

AfterStep(async function (step, scenario) {
    if (scenario.result?.status === 'failed') {
        allure.startStep(`❌ Step Failed: ${step.pickleStep.text}`);
        const errorMessage = scenario.result?.message || 'Unknown error';

        let screenshot;
        let locator = null;

        // ✅ Extract locator if available
        const locatorMatch = errorMessage.match(/element\["(.*?)"\]/);
        if (locatorMatch) {
            locator = locatorMatch[1];
        }

        try {
            // ✅ If locator exists, try to highlight it
            if (locator) {
                await highlightElement(locator);
            }

            // 📸 Try to take a screenshot
            screenshot = await browser.takeScreenshot();
        } catch (error) {
            console.warn("⚠️ Could not highlight element, taking full-page screenshot.");
            screenshot = await browser.takeScreenshot(); // ✅ Take a full-page screenshot if highlighting fails
        }

        // ✅ Attach Screenshot to Allure
        allure.addAttachment('Failure Screenshot', screenshot, 'image/png');

        // ✅ Instead of `setStatus()`, use `endStep('failed')`
        if (errorMessage.includes('no such element') || errorMessage.includes('element could not be located')) {
            allure.endStep('broken');  // ⚠️ Broken for missing elements
        } else if (errorMessage.includes('timeout') || errorMessage.includes('stale element')) {
            allure.endStep('broken');  // ⚠️ Broken for timeout & stale element issues
        } else if (errorMessage.includes('assertion') || errorMessage.includes('expected')) {
            allure.endStep('failed');  // ❌ Failed for assertion errors
        } else {
            allure.endStep('broken');  // ⚠️ Default to broken for unknown WebDriver issues
        }
    }
});

import { AfterStep } from '@cucumber/cucumber';
import { browser } from '@wdio/globals';
import { allure } from 'allure-mocha/runtime';

AfterStep(async function (step, scenario) {
    if (scenario.result?.status === 'failed') {
        allure.startStep(`❌ Step Failed: ${step.pickleStep.text}`);
        const errorMessage = scenario.result?.message || 'Unknown error';

        let screenshot;
        let locator = null;

        // ✅ Extract locator if available from the error message
        const locatorMatch = errorMessage.match(/element\["(.*?)"\]/);
        if (locatorMatch) {
            locator = locatorMatch[1];
        }

        try {
            // ✅ If the locator is present in the error, try to highlight it
            if (locator) {
                const element = await $(locator);
                await browser.execute("arguments[0].style.border='3px solid red'", element);
            }

            // 📸 Try to take a screenshot
            screenshot = await browser.takeScreenshot();
        } catch (error) {
            console.warn("⚠️ Could not highlight element, taking full-page screenshot.");
            screenshot = await browser.takeScreenshot(); // ✅ Take a full-page screenshot if highlighting fails
        }

        // ✅ Attach Screenshot to Allure
        allure.addAttachment('Failure Screenshot', screenshot, 'image/png');

        // ✅ Mark the test properly in Allure (Use `endStep()` instead of `setStatus()`)
        if (errorMessage.includes('no such element') || errorMessage.includes('element could not be located')) {
            allure.endStep('broken');  // ⚠️ Mark missing elements as "Broken" (Yellow)
        } else if (errorMessage.includes('timeout') || errorMessage.includes('stale element')) {
            allure.endStep('broken');  // ⚠️ Mark timeouts & stale elements as "Broken" (Yellow)
        } else if (errorMessage.includes('assertion') || errorMessage.includes('expected')) {
            allure.endStep('failed');  // ❌ Mark assertion failures as "Failed" (Red)
        } else {
            allure.endStep('broken');  // ⚠️ Default to "Broken" for unknown WebDriver issues
        }
    }
});

import { AfterStep } from '@cucumber/cucumber';

AfterStep(async function (scenario: any) {
    if (scenario.result?.status === 'failed') {
        try {
            // Extract the failing locator from the error message if possible
            const errorMessage = scenario.result?.message || '';
            const locatorMatch = errorMessage.match(/element\[["'](.*?)["']\]/);
            if (locatorMatch) {
                const locator = locatorMatch[1];
                const element = await $(locator);

                // Highlight the failing element
                await browser.execute("arguments[0].style.border='3px solid red'", element);
            }
        } catch (error) {
            console.error('Error highlighting the failing element:', error);
        }

        // Take the screenshot after highlighting
        const screenshot = await browser.takeScreenshot();
        await allure.addAttachment('Failure Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
    }
});

import { AfterStep, After } from '@cucumber/cucumber';

// 🛑 Capture screenshot for failed steps
AfterStep(async function (scenario: any) {
    if (scenario.result?.status === 'failed') {
        await captureScreenshot('Step Failure');
    }
});

// ❌ Capture screenshot for broken tests (timeouts, undefined steps, etc.)
After(async function (scenario: any) {
    if (scenario.result?.status === 'failed' || scenario.result === undefined) {
        await captureScreenshot('Scenario Failure (Possibly Undefined Step)');
    }
});

// 📸 Function to take a screenshot
async function captureScreenshot(reason: string) {
    try {
        const screenshot = await browser.takeScreenshot();
        await allure.addAttachment(`Failure Screenshot - ${reason}`, Buffer.from(screenshot, 'base64'), 'image/png');
    } catch (error) {
        console.error('Error taking screenshot:', error);
    }
}


