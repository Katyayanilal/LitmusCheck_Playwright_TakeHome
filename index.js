const { chromium } = require("playwright");

// --- helper: convert "2 hours ago" into minutes
function parseAgeToMinutes(ageText) {
  if (!ageText) return Number.POSITIVE_INFINITY;
  ageText = ageText.toLowerCase().trim();
  if (ageText === "just now") return 0;
  const m = ageText.match(/(\d+)\s*(second|minute|hour|day|month|year)/i);
  if (!m) return Number.POSITIVE_INFINITY; // fallback
  const value = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const multipliers = {
    second: 1 / 60,
    minute: 1,
    hour: 60,
    day: 60 * 24,
    month: 60 * 24 * 30,
    year: 60 * 24 * 365,
  };
  return value * (multipliers[unit] || 1);
}

// --- helper: collect N articles across multiple pages
async function collectFirstNArticles(page, n) {
  const articles = [];
  const ids = new Set();
  let tries = 0;

  while (articles.length < n && tries < 10) {
    tries++;
    await page.waitForSelector("tr.athing", { timeout: 10000 });

    const pageItems = await page.$$eval("tr.athing", (rows) =>
      rows.map((row) => {
        const id = row.getAttribute("id") || "";
        const titleEl = row.querySelector(".titleline a");
        const title = titleEl ? titleEl.innerText.trim() : "";
        const link = titleEl ? titleEl.href : "";
        const sub = row.nextElementSibling?.querySelector(".subtext");
        const age = sub?.querySelector(".age")?.innerText || "";
        const points = sub?.querySelector(".score")?.innerText || "0 points";
        const author = sub?.querySelector(".hnuser")?.innerText || "";
        return { id, title, link, age, points, author };
      })
    );

    for (const item of pageItems) {
      if (!ids.has(item.id)) {
        ids.add(item.id);
        articles.push(item);
        if (articles.length >= n) break;
      }
    }

    if (articles.length >= n) break;

    const more = await page.$("a.morelink");
    if (!more) break;

    await Promise.all([
      page.click("a.morelink"),
      page.waitForNavigation({ waitUntil: "load", timeout: 15000 }),
    ]);
  }

  return articles.slice(0, n);
}

// --- main validation function (continuing from starter)
async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://news.ycombinator.com/newest", { waitUntil: "load" });

    const first100 = await collectFirstNArticles(page, 100);

    if (first100.length !== 100) {
      console.error(
        `ERROR: Could only collect ${first100.length} articles. Cannot validate EXACTLY 100 articles.`
      );

      console.table(
        first100.map((a, i) => ({
          index: i + 1,
          id: a.id,
          title: a.title,
          age: a.age,
        }))
      );
      await browser.close();
      process.exitCode = 2;
      return;
    }
    console.log(`Exactly ${first100.length} articles collected.`);

    const enriched = first100.map((a, idx) => ({
      index: idx + 1,
      id: a.id,
      title: a.title,
      ageText: a.age,
      ageMinutes: parseAgeToMinutes(a.age),
    }));

    // validate ordering (newest --> oldest)
    let sorted = true;
    let violation = null;
    for (let i = 0; i < enriched.length - 1; i++) {
      if (enriched[i].ageMinutes > enriched[i + 1].ageMinutes) {
        sorted = false;
        violation = { pos: i + 1, first: enriched[i], second: enriched[i + 1] };
        break;
      }
    }

    if (sorted) {
      console.log("PASS: The first 100 articles are sorted newest → oldest.");
    } else {
      console.error("FAIL: Sorting violation detected.");
      console.error("Violation at position:", violation.pos);
      console.table([violation.first, violation.second]);
      const start = Math.max(0, violation.pos - 3);
      console.log("Nearby items:");
      console.table(enriched.slice(start, start + 6));
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exitCode = 3;
  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();