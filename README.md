# LitmusCheck Playwright Take-Home Assignment
A Playwright take-home assignment that validates the first 100 Hacker News “newest” articles are sorted from newest to oldest, with supporting test plan and run instructions. Implemented using **Playwright** and **JavaScript**.

The objective of the assignment is to:
1. Collect the first **100 articles** from the [Hacker News “newest” page](https://news.ycombinator.com/newest).  
2. Validate that these 100 articles are sorted in **descending chronological order** — from **newest → oldest**.  
3. Ensure that exactly **100 unique articles** are collected (no more, no fewer).  
4. Provide a **functional test plan** describing additional validations for the page.  
5. Record a Loom video to explain the approach, demonstrate the working solution, and summarize the test plan.  

## Project Structure
- `index.js` — Playwright script that collects articles, validates the order, and checks that exactly 100 are collected.  
- `TestPlan.md` — Functional test plan for the Hacker News `/newest` page.  
- `README.md` — Project description and run instructions.  
- `package.json` — Node.js configuration and npm scripts.  

## Setup & Run Instructions

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/LitmusCheck_Playwright_TakeHome.git
cd LitmusCheck_Playwright_TakeHome


### 2. Install dependencies
npm install
npx playwright install

### 3. Run the Script
node index.js or npm start

### 4. Expected Output
 Exactly 100 articles collected.
 PASS: The first 100 articles are sorted newest -> oldest.
