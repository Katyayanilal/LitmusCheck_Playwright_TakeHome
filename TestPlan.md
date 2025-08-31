# Test Plan — Hacker News `/newest` Page

**Author:** <Katyayani Lal>  
**Date:** <30-08-2025>  
**Target URL:** [https://news.ycombinator.com/newest](https://news.ycombinator.com/newest)  


## Objective
Validate the functional correctness, UI behavior, and data integrity of the Hacker News **"newest"** feed.  
Specifically, ensure that the first **100 articles** (across pagination) are unique, correctly structured, and ordered from **newest → oldest**.

## Scope
**In Scope**
- Ordering of first 100 articles.  
- Presence and validation of key fields (title, link, author, age, points).  
- Pagination behavior using the **"More"** button.  
- Duplicate detection within the first 100 items.  
- Error handling for missing or malformed fields.  
- Basic cross-browser check (Chromium/Firefox).  

**Out of Scope**
- Logged-in user features (upvotes, comments posting).  
- Backend performance/load testing.  
- Full accessibility audit (only basic checks will be done).  


## Test Items
1. **Ordering** — Articles must appear newest → oldest.  
2. **Article Fields** — Each article should include:  
   - Title (non-empty)  
   - Link (valid, loads with status <400)  
   - Age (parseable, e.g., “3 hours ago”)  
   - Author (if available)  
   - Points (if applicable — job posts may not have this field)  
3. **Pagination** — Clicking **"More"** loads next set of articles without duplicates.  
4. **Uniqueness** — No repeated article IDs within first 100 items.  
5. **Error Handling** — Script handles missing fields gracefully without crashing.  


## Test Cases

### TC1 — Collect 100 Articles
- **Steps:**  
  - Load `/newest`.  
  - Click **"More"** until 100 articles are collected.  
- **Expected Result:**  
  - Exactly 100 **unique** articles are collected.  

### TC2 — Validate Ordering
- **Steps:**  
  - Convert article ages into minutes.  
  - Verify non-decreasing order across first 100.  
- **Expected Result:**  
  - For all items `i`, `age[i] <= age[i+1]`.  

### TC3 — Validate Article Fields
- **Steps:**  
  - For each article, check that `title` and `link` are non-empty.  
  - Validate that **age text** exists and is parseable.  
  - Validate **author** and **points** (if present).  
- **Expected Result:**  
  - All required fields exist and contain valid data.  

### TC4 — Pagination & Uniqueness
- **Steps:**  
  - Navigate with **"More"** until 100 articles.  
  - Track article IDs for duplicates.  
- **Expected Result:**  
  - 100 unique IDs.  
  - Pagination continuity is preserved.  

### TC5 — Link Openability
- **Steps:**  
  - Open sample links (1st, 50th, 100th article).  
  - Validate HTTP status <400 or successful page load.  
- **Expected Result:**  
  - All sampled links are valid and accessible.  

### TC6 — Accessibility & Structure (Basic)
- **Steps:**  
  - Verify semantic HTML usage (`<table>`, `<tr class="athing">`, etc.).  
  - Check basic keyboard navigation.  
- **Expected Result:**  
  - Elements are accessible with proper structure.  

### TC7 — Error Handling Simulation
- **Steps:**  
  - Simulate network timeout / failure.  
  - Observe system response.  
- **Expected Result:**  
  - User sees fallback/error message.  
  - Script fails gracefully with clear logging.  

## Non-Functional Checks
- **Performance:** Script should complete within 60s (headless run).  
- **Reliability:** Handle transient network issues with retries.  
- **Cross-Browser:** Spot-check in Chromium and Firefox.  

## Acceptance Criteria
- **PASS** only if:  
  - 100 **unique** items are collected.  
  - Ordering check succeeds (newest → oldest).  
  - No required field is missing.  
  - Pagination is continuous.  
- **FAIL** if:  
  - Duplicate IDs found.  
  - Order violation occurs.  
  - Link/field validation fails.  
- Script must log **clear failure reasons** with sample problematic articles.  

## Tools & References
- **Automation:** Playwright (JavaScript)  
- **Manual Checks:** Browser inspection  
- **Accessibility (Optional):** Axe-core  