const site = "https://www.jesusfestival.app";
const host = "www.jesusfestival.app";
const key = "89c195b99b3595b9e69e572e3a7ec226";
const keyLocation = `${site}/${key}.txt`;

const sitemapResponse = await fetch(`${site}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Could not read production sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("Production sitemap contained no URLs");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected the submission: HTTP ${response.status} ${await response.text()}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs with HTTP ${response.status}.`);
