# 🚀 Push to GitHub & Deploy - Step by Step

## ⚡ Quick Commands (Copy & Paste)

### 1. Navigate to Project
```bash
cd ~/Desktop/SESEC/sesec-partner-map-app
```

### 2. Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: SESEC Partner Map v1.0 with 57 partners"
```

### 3. Create GitHub Repository

**Option A: Via GitHub Website (Easier)**
1. Go to https://github.com/new
2. Repository name: `sesec-partner-map`
3. Description: `Interactive directory of 57+ Southeast Seattle education partners`
4. Public repository (recommended)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

**Option B: Via GitHub CLI (If installed)**
```bash
gh repo create sesec-partner-map --public --source=. --remote=origin --push
```

### 4. Connect and Push (Option A users)

**Replace `YOUR_USERNAME` with your GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/sesec-partner-map.git
git branch -M main
git push -u origin main
```

**If it asks for credentials:**
- Username: Your GitHub username
- Password: Your Personal Access Token (NOT your GitHub password)
  - Get token: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select: `repo` scope
  - Generate and copy the token
  - Paste as password

✅ **Code is now on GitHub!**

View at: https://github.com/YOUR_USERNAME/sesec-partner-map

---

## 🌐 Deploy to Netlify (5 minutes)

### Method 1: Via Netlify Dashboard (Easiest)

1. **Go to https://app.netlify.com**
   - Sign up/login (use GitHub account for easy connection)

2. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify (one-time)
   - Select `sesec-partner-map` repository

3. **Configure (Use Defaults):**
   - Branch to deploy: `main`
   - Build command: (leave empty)
   - Publish directory: (leave empty or `/`)
   - Click "Deploy site"

4. **Wait ~30 seconds...**
   - ✅ Site is live!
   - URL: `https://random-name-123.netlify.app`
   - Click to visit your site

5. **Test Everything:**
   - [ ] Site loads
   - [ ] All 57 partners visible
   - [ ] Search works
   - [ ] Filters work
   - [ ] Click partner → details modal
   - [ ] Test on mobile

### Method 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init

# Follow prompts:
# - Create & configure new site
# - Connect to Git
# - Deploy automatically on git push
```

---

## 🎯 Custom Domain Setup (Optional)

### If you have `sesecwa.org` and want `partnermap.sesecwa.org`:

1. **In Netlify Dashboard:**
   - Site settings → Domain management
   - Add custom domain
   - Enter: `partnermap.sesecwa.org`
   - Follow verification steps

2. **In Your DNS Provider (where you manage sesecwa.org):**
   - Add CNAME record:
     - Type: `CNAME`
     - Name: `partnermap`
     - Value: `YOUR-SITE-NAME.netlify.app`
     - TTL: `3600` (or auto)
   - Save

3. **Wait 5-30 minutes for DNS propagation**

4. **Back in Netlify:**
   - It will detect the DNS change
   - HTTPS will be enabled automatically (Let's Encrypt)
   - ✅ Site live at: https://partnermap.sesecwa.org

---

## ✅ Pre-Flight Checklist

Before pushing, verify:

- [ ] `data/partners.csv` exists and has data (57 rows)
- [ ] `index.html` opens in browser locally
- [ ] Search and filters work locally
- [ ] No console errors (F12 → Console)
- [ ] README.md updated with your info
- [ ] package.json updated with your repo URL

---

## 🔄 Future Updates

### Update Partner Data

```bash
# 1. Edit data/partners.csv
# 2. Save changes

# 3. Commit and push
git add data/partners.csv
git commit -m "Update partner information for March 2026"
git push

# ✅ Site updates automatically in 30 seconds!
```

### Update Code

```bash
# 1. Make code changes
# 2. Test locally

# 3. Commit and push
git add .
git commit -m "Add export to PDF feature"
git push

# ✅ Site updates automatically!
```

---

## 🐛 Troubleshooting

### Error: "fatal: not a git repository"

**Solution:**
```bash
cd ~/Desktop/SESEC/sesec-partner-map-app
git init
```

### Error: "failed to push some refs"

**Solution:**
```bash
git pull origin main --rebase
git push
```

### Error: CSV file not loading on deployed site

**Check:**
```bash
# Verify file exists
ls -la data/partners.csv

# If missing, add it
cp ~/Desktop/SESEC/sesec_partner_mapping.csv data/partners.csv
git add data/partners.csv
git commit -m "Add partner data file"
git push
```

### Authentication Failed

**Solution: Use Personal Access Token**

1. Go to: https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Select scopes: `repo`
4. Generate token
5. Copy token (save somewhere safe!)
6. When git asks for password, paste the token

### Want to use SSH instead?

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for all prompts

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy the output

# Add to GitHub:
# Settings → SSH and GPG keys → New SSH key
# Paste the key

# Update remote URL
git remote set-url origin git@github.com:YOUR_USERNAME/sesec-partner-map.git

# Push
git push
```

---

## 📊 Verify Deployment

### Check GitHub:
- Go to: https://github.com/YOUR_USERNAME/sesec-partner-map
- [ ] All files visible
- [ ] README.md displays properly
- [ ] data/partners.csv has content

### Check Netlify:
- Go to: https://app.netlify.com
- [ ] Site status: Published
- [ ] Build time: ~30 seconds
- [ ] Deploy log: no errors
- [ ] Site preview works

### Check Live Site:
- Visit your Netlify URL
- [ ] Loads in <2 seconds
- [ ] HTTPS enabled (lock icon)
- [ ] All 57 partners load
- [ ] Search: Try "literacy" → 8 results
- [ ] Filter: Category 2 → 44 results
- [ ] Click partner → Modal opens
- [ ] Mobile: Responsive design works

---

## 🎉 Success Criteria

You're done when:
- ✅ Code on GitHub
- ✅ Site live on Netlify
- ✅ All features working
- ✅ Custom domain configured (if desired)
- ✅ Team has access to dashboards
- ✅ Shared with 3-5 people for testing

---

## 📧 Share With Team

### Sample Slack/Email Message:

```
🎉 SESEC Partner Map is LIVE!

🔗 https://partnermap.sesecwa.org (or your Netlify URL)

Features:
✅ 57 partner organizations mapped
✅ Search by keyword
✅ Filter by service category, geography, themes
✅ Mobile-friendly
✅ Contact info for every partner

Try it out and let me know what you think!

To update partner data:
- Edit data/partners.csv on GitHub
- Changes go live automatically

GitHub: https://github.com/YOUR_USERNAME/sesec-partner-map
Docs: See README.md

Questions? Reply here or open an issue on GitHub.
```

---

## 🎓 What You Just Built

- ✅ Production-ready web application
- ✅ Hosted on enterprise-grade infrastructure
- ✅ Automatic deployments via Git
- ✅ HTTPS security
- ✅ Global CDN distribution
- ✅ 99.9% uptime SLA
- ✅ Zero monthly costs

**Total setup time: 15-30 minutes**

**Your site will handle:**
- 10,000+ monthly visitors
- 100GB bandwidth
- Sub-second page loads worldwide

---

## 📚 Next Steps

1. **Share with partners** (see template above)
2. **Gather feedback** (what works? what's missing?)
3. **Iterate** (fix bugs, add features)
4. **Plan Phase 2** (dynamic scraping, admin dashboard)

See `docs/ROADMAP.md` for future enhancements.

---

## 💬 Need Help?

**GitHub Issues:**
- Bug reports: https://github.com/YOUR_USERNAME/sesec-partner-map/issues
- Feature requests: Add [Feature Request] tag

**Deployment Issues:**
- Netlify Support: https://answers.netlify.com
- GitHub Docs: https://docs.github.com

**Questions:**
- Email: [your-email]
- Create discussion: https://github.com/YOUR_USERNAME/sesec-partner-map/discussions

---

## 🚀 Ready to Deploy!

**Run these commands now:**

```bash
cd ~/Desktop/SESEC/sesec-partner-map-app
git init
git add .
git commit -m "Initial commit: SESEC Partner Map v1.0"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/sesec-partner-map.git
git branch -M main
git push -u origin main

# Then deploy to Netlify via dashboard
```

**Good luck! 🎉**

---

**Last Updated:** March 2026
