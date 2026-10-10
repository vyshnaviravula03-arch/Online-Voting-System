# Online Voting System — Academic Demo

## Project overview
A beginner-friendly front-end voting prototype built with HTML, CSS, and JavaScript. It includes candidate selection, one-vote-per-demo-ID checks, browser-local result totals, and an explainable rule-based anomaly alert.

## Requirements
- A modern web browser (Chrome, Firefox, Edge, etc.)
- Optional: Visual Studio Code
- No package installation or server required for this demo

## Setup
1. Extract `online_voting_system_project.zip`.
2. Open the project folder.
3. Double-click `index.html`, or open it with your browser.
4. Enter a demo ID such as `DEMO101`, select a candidate, and submit.
5. Try the same ID again to see the duplicate-attempt alert.
6. Use **Reset demo data** to clear the saved sample votes.

## Files
- `index.html` — page structure and form
- `style.css` — responsive styling
- `script.js` — vote checks, localStorage, result totals, and rule-based alerts
- `Project_Report.pdf` — project report

## AI/ML note
The current version does **not** train or run a machine-learning model. The anomaly panel is a transparent, rule-based simulation that illustrates a related concept. A genuine ML extension would need an approved, privacy-conscious dataset, a trained model, evaluation metrics, and server-side integration.

## Important security limitation
This is a classroom prototype only, not a secure election platform. Browser localStorage can be edited or deleted; IDs are not verified; there is no authentication, backend, database, audit infrastructure, or cryptographic protection. Do not use it for real elections or collect real voter data.
