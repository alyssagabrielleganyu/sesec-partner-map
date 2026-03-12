# Getting Started - SESEC Partner Map

## 🎯 Goal
Get your partner map live on the internet in the next 30 minutes.

---

## ⚡ Super Quick Start (Copy & Paste)

### Step 1: Create GitHub Repository (5 minutes)

1. **Go to GitHub.com**
   - Sign in (or create free account)
   - Click the `+` icon → "New repository"

2. **Repository Settings:**
   - Name: `sesec-partner-map`
   - Description: `Interactive directory of Southeast Seattle education partners`
   - Public (recommended) or Private
   - Click "Create repository"

3. **Push Your Code:**
   ```bash
   cd ~/Desktop/SESEC/sesec-partner-map-app

   # Initialize git
   git init
   git add .
   git commit -m "Initial commit: SESEC Partner Map v1.0"

   # Connect to GitHub (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/sesec-partner-map.git
   git branch -M main
   git push -u origin main
   ```

✅ **Code is now on GitHub!**

---

### Step 2: Deploy to Netlify (5 minutes)

1. **Go to netlify.com**
   - Click "Sign up" (use GitHub account for easy connection)

2. **Deploy Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access GitHub
   - Select `sesec-partner-map` repository
   - Leave all settings as default
   - Click "Deploy site"

3. **Wait 30 seconds...**
   - ✅ Site is live!
   - URL: `https://random-name-123.netlify.app`

4. **Test Your Site:**
   - Click the URL
   - Try searching for a partner
   - Test filters
   - Open on your phone

✅ **Your map is LIVE on the internet!**

---

### Step 3: Custom Domain (Optional, 15 minutes)

1. **In Netlify Dashboard:**
   - Click "Domain settings"
   - "Add custom domain"
   - Enter: `partnermap.sesecwa.org` (or your choice)

2. **Configure DNS:**
   - Go to your domain registrar (where you bought sesecwa.org)
   - Add CNAME record:
     - Name: `partnermap`
     - Value: `YOUR-SITE.netlify.app`

3. **Wait 5-30 minutes for DNS to propagate**

4. **Enable HTTPS:**
   - In Netlify: Automatic!
   - Verify: Visit `https://partnermap.sesecwa.org`

✅ **Professional custom domain configured!**

---

## 📝 Updating Your Site

### Update Partner Data

**Method 1: Edit on GitHub (Easiest)**
1. Go to your repo on GitHub
2. Click `data/partners.csv`
3. Click pencil icon to edit
4. Make changes
5. Scroll down → "Commit changes"
6. ✅ Site updates automatically in 30 seconds

**Method 2: Edit Locally**
1. Open `data/partners.csv` in Excel
2. Make changes, save as CSV
3. In terminal:
   ```bash
   cd ~/Desktop/SESEC/sesec-partner-map-app
   git add data/partners.csv
   git commit -m "Update partner information"
   git push
   ```
4. ✅ Site updates automatically in 30 seconds

---

## 🎨 Customizing the Site

### Change Colors

Edit `src/css/styles.css`:
```css
:root {
    --primary: #2563eb;        /* Change this to your brand color */
    --primary-dark: #1e40af;   /* Darker shade */
    --secondary: #10b981;      /* Accent color */
}
```

### Change Header Text

Edit `index.html`:
```html
<h1 class="header-title">🗺️ SESEC Partner Map</h1>
<p class="header-subtitle">Your custom text here...</p>
```

### Add Logo

1. Add logo file to project: `logo.png`
2. Edit `index.html` header:
   ```html
   <img src="logo.png" alt="SESEC Logo" style="height: 60px;">
   ```

---

## 🔍 Testing Checklist

Before sharing with partners:

- [ ] All 57 partners appear
- [ ] Search works (try "literacy")
- [ ] Filters work (try Category 2)
- [ ] Click a partner → details modal opens
- [ ] Contact links work (email, website, phone)
- [ ] Mobile view looks good
- [ ] HTTPS enabled (lock icon in browser)
- [ ] Custom domain works (if configured)

---

## 📧 Sharing With Partners

### Sample Email:

```
Subject: New SESEC Partner Directory is Live!

Hi [Partner Name],

We're excited to share the new SESEC Partner Interactive Map:
🔗 https://partnermap.sesecwa.org

This resource helps partners:
- Discover collaboration opportunities
- Make warm referrals to complementary organizations
- Identify service gaps in our community

Your organization is included! Please review your profile and let us know if any information needs updating.

Search, filter by service category, or browse all 57+ partners in the ecosystem.

Questions or updates? Reply to this email.

Best,
[Your Name]
SESEC Team
```

---

## 🆘 Troubleshooting

### "Failed to load partner data"

**Solution:**
```bash
# Check CSV file exists
ls -la data/partners.csv

# If missing, copy it again
cp ~/Desktop/SESEC/sesec_partner_mapping.csv data/partners.csv

# Commit and push
git add data/partners.csv
git commit -m "Add partner data"
git push
```

### Git push asks for username/password

**Solution: Use Personal Access Token**
1. Go to GitHub.com → Settings → Developer settings
2. Personal access tokens → Generate new token (classic)
3. Check "repo" scope
4. Copy token (save it somewhere!)
5. Use token as password when pushing

**Or use SSH:**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH keys → New SSH key
# Paste contents of: ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/sesec-partner-map.git
```

### Site works locally but not deployed

**Solution:**
- Check Netlify deployment log for errors
- Verify all files are pushed to GitHub
- Check file paths are correct (case-sensitive!)
- Clear browser cache

---

## 🎓 Next Steps

### Week 1: Launch
- [ ] Deploy site
- [ ] Test thoroughly
- [ ] Share with 5 pilot partners
- [ ] Gather feedback

### Week 2-4: Iterate
- [ ] Fix any bugs reported
- [ ] Update partner data as needed
- [ ] Add analytics (Google Analytics)
- [ ] Document most-searched partners

### Month 2+: Enhance
- [ ] Review feedback from all partners
- [ ] Plan Phase 2 features (see ROADMAP.md)
- [ ] Consider dynamic data updates
- [ ] Explore partnership matching features

---

## 📚 Learn More

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **docs/ROADMAP.md** - Future development plans

---

## 💬 Get Help

**Technical Issues:**
- Create issue: https://github.com/YOUR_USERNAME/sesec-partner-map/issues
- Email: [tech contact]

**Data Updates:**
- Email: [contact@sesecwa.org]

**Feature Requests:**
- Discussions: https://github.com/YOUR_USERNAME/sesec-partner-map/discussions

---

## 🎉 That's It!

You now have:
- ✅ Code on GitHub
- ✅ Live website on Netlify
- ✅ Automatic deployments
- ✅ HTTPS security
- ✅ Custom domain (optional)

**Total time investment: ~30 minutes**

Now go share it with your partners! 🚀

---

**Need help?** Don't hesitate to reach out. We're here to make this successful!

**Last Updated:** March 2026
