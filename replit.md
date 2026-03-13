# GJH INC Website

## Project Overview
Static HTML website for GJH INC (GJH Consulting and Services) — a strategic consulting, technology services, and managed services company.

## Tech Stack
- Pure static HTML/CSS/JS (no build system, no framework)
- Assets served from `assets/` directory (CSS, JS, images)

## Project Structure
- `index.html` — Homepage
- `services.html` — Services page
- `markets.html` — Markets page
- `careers.html` — Careers page
- `capabilityStatement.html` — Capability statement page
- `webdevelopment.html` — Web development page
- `privacy.html` — Privacy policy
- `terms.html` — Terms of service
- `404.html` — 404 error page
- `robots.txt` — SEO robots file
- `sitemap.xml` — Sitemap
- `assets/css/` — Stylesheets (font.css, index.css)
- `assets/js/main.js` — Main JavaScript
- `assets/images/` — Image assets

## Development
The site is served using Python's built-in HTTP server:
```
python3 -m http.server 5000 --bind 0.0.0.0
```
Runs on port 5000 via the "Start application" workflow.

## Deployment
Configured as a static deployment with `publicDir: "."`.
