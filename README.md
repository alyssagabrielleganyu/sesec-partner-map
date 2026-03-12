# SESEC Partner Map

Interactive web application for exploring 57+ partner organizations serving Southeast Seattle's education ecosystem.

🔗 **Live Site:** [Add your deployed URL here]

---

## Features

- 🔍 **Smart Search** - Real-time search across organizations, missions, services, and communities
- 🎯 **Advanced Filtering** - Filter by 4 service categories, geography, and themes
- 📊 **Dual View Modes** - Toggle between grid cards and list view
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG compliant with keyboard navigation and screen reader support
- ⚡ **Fast & Lightweight** - Pure vanilla JavaScript, no frameworks required

---

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sesec-partner-map.git

# Navigate to directory
cd sesec-partner-map

# Open in browser (requires local server for CSV loading)
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit: http://localhost:8000

---

## Deployment

### Option 1: Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy! No build configuration needed

### Option 2: GitHub Pages

```bash
# Enable GitHub Pages in repository settings
# Select branch: main
# Folder: / (root)
# Your site will be at: https://YOUR_USERNAME.github.io/sesec-partner-map/
```

### Option 3: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Project Structure

```
sesec-partner-map/
├── index.html          # Main application file
├── data/
│   └── partners.csv    # Partner data (57 organizations)
├── src/
│   ├── css/
│   │   └── styles.css  # Application styles
│   └── js/
│       └── app.js      # Application logic
├── docs/               # Documentation
├── README.md           # This file
├── DEPLOYMENT.md       # Deployment guide
└── .gitignore         # Git ignore rules
```

---

## Data Format

Partner data is stored in `data/partners.csv` with the following columns:

- Organization Name
- URL
- Mission/Summary
- Category 1-4 (Integrated Support, Expanded Learning, Family Engagement, Collaborative Leadership)
- Target Communities
- Geographic Area
- Address, Email, Phone
- Additional Themes

### Updating Data

1. Edit `data/partners.csv` in Excel/Google Sheets
2. Save as CSV (UTF-8 encoding)
3. Commit and push changes
4. Site updates automatically on deployment

---

## Future Enhancements

### Phase 1: Dynamic Data (In Progress)
- [ ] API endpoint for partner data
- [ ] Admin dashboard for data management
- [ ] Automated web scraping for updates
- [ ] Partner self-service portal

### Phase 2: Advanced Features
- [ ] Geographic map view
- [ ] Partnership recommendation engine
- [ ] Referral tracking system
- [ ] Multi-language support
- [ ] Mobile apps

See [ROADMAP.md](./docs/ROADMAP.md) for complete development plan.

---

## Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Data:** CSV file (future: REST API + PostgreSQL)
- **Hosting:** Static site (Netlify, Vercel, GitHub Pages)
- **Future Backend:** Node.js/Python + FastAPI

### Why Vanilla JS?

- Zero dependencies = faster load times
- No build step required
- Easy for anyone to contribute
- Future-proof and maintainable
- Can add frameworks later if needed

---

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

We welcome contributions! Here's how:

1. **Report Issues:** [Create an issue](../../issues)
2. **Suggest Features:** [Open a discussion](../../discussions)
3. **Submit Code:**
   ```bash
   # Fork the repository
   # Create a feature branch
   git checkout -b feature/your-feature-name

   # Make changes and commit
   git commit -m "Add your feature"

   # Push and create pull request
   git push origin feature/your-feature-name
   ```

### Development Guidelines

- Maintain vanilla JavaScript (no frameworks)
- Follow existing code style
- Test on multiple browsers
- Update documentation
- Add comments for complex logic

---

## Data Privacy

- No personal data collected
- No tracking or analytics by default
- All data is public information from partner websites
- Partners can request updates or removal

---

## License

This project is created for the Southeast Seattle Education Coalition (SESEC).

Partner data is compiled from publicly available sources. Organizations retain rights to their own information and branding.

---

## Contact

**Project Maintainer:** [Your Name/SESEC Contact]
**Email:** [contact@sesecwa.org]
**Website:** https://www.sesecwa.org

**Technical Issues:** [Create an issue](../../issues)
**Data Updates:** Email [contact@sesecwa.org]

---

## Acknowledgments

- 57 partner organizations serving Southeast Seattle
- SESEC coalition members and staff
- Community stakeholders who provided feedback

---

## Quick Links

- 📊 [Live Application](https://your-site-url.com)
- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 🗺️ [Development Roadmap](./docs/ROADMAP.md)
- 🐛 [Report Issue](../../issues)
- 💬 [Discussions](../../discussions)

---

**Version:** 1.0
**Last Updated:** March 2026
**Status:** ✅ Production Ready
