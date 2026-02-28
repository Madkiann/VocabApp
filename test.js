import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    try {
        await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(3000);
        const html = await page.content();
        const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
        console.log("Root Length:", rootHtml.length);
        console.log("Contains FERHAT:", rootHtml.includes("FERHAT"));
        console.log("Contains Card Info:", rootHtml.includes("Dayan"));
        console.log("First 2000 chars:", rootHtml.substring(0, 2000));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await browser.close();
    }
})();
