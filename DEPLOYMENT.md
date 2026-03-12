# Deployment Guide - SESEC Partner Map

This guide will help you deploy the SESEC Partner Map to a live website.

---

## 🚀 Quick Deploy (5 minutes)

### Method 1: Netlify (Recommended - Easiest)

**Why Netlify?**
- ✅ Free forever for static sites
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Easy custom domain setup

**Steps:**

1. **Create GitHub Repository**
   ```bash
   cd sesec-partner-map-app
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/sesec-partner-map.git
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Leave all settings as default
   - Click "Deploy site"
   - ✅ Done! Site will be live at: `https://random-name.netlify.app`

3. **Custom Domain (Optional)**
   - In Netlify dashboard: "Domain settings"
   - Click "Add custom domain"
   - Enter: `partnermap.sesecwa.org`
   - Follow DNS configuration instructions
   - HTTPS automatically enabled

**Automatic Updates:**
- Every git push automatically deploys
- Takes 30-60 seconds
- No manual action needed

---

### Method 2: GitHub Pages (100% Free)

**Why GitHub Pages?**
- ✅ Completely free
- ✅ Integrated with GitHub
- ✅ No extra account needed

**Steps:**

1. **Push Code to GitHub**
   ```bash
   cd sesec-partner-map-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sesec-partner-map.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Click "Save"

3. **Access Your Site**
   - URL: `https://YOUR_USERNAME.github.io/sesec-partner-map/`
   - Takes 2-3 minutes to go live
   - Every git push rebuilds the site

**Custom Domain:**
- In Pages settings, add custom domain
- Configure DNS: CNAME record pointing to `YOUR_USERNAME.github.io`

---

### Method 3: Vercel (Fast & Modern)

**Why Vercel?**
- ✅ Extremely fast deploys
- ✅ Excellent performance
- ✅ Preview deployments for PRs
- ✅ Easy rollbacks

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd sesec-partner-map-app
   vercel
   # Follow prompts (defaults work great)
   ```

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

**Or use Vercel Dashboard:**
- Go to [vercel.com](https://vercel.com)
- "Add New Project"
- Import from GitHub
- Deploy!

---

## 🔄 Setting Up Continuous Deployment

### Automatic Deploys from Git

**Netlify:**
- Already automatic! Every push to main branch deploys

**GitHub Pages:**
- Already automatic! Every push to main branch deploys

**Vercel:**
- Already automatic! Every push to main branch deploys

### Preview Branches

**Netlify:**
- Every branch gets a preview URL
- PRs show preview link
- Test before merging

**Vercel:**
- Same as Netlify - automatic preview deployments

---

## 🌐 Custom Domain Setup

### Option 1: Subdomain (Recommended)

**Setup: `partnermap.sesecwa.org`**

1. **Log into your DNS provider** (where sesecwa.org is registered)

2. **Add CNAME record:**
   - **Type:** CNAME
   - **Name:** partnermap
   - **Value:** (depends on host)
     - Netlify: `YOUR-SITE.netlify.app`
     - GitHub Pages: `YOUR_USERNAME.github.io`
     - Vercel: `cname.vercel-dns.com`
   - **TTL:** 3600 (or automatic)

3. **Update hosting platform:**
   - Netlify: Domain settings → Add custom domain
   - GitHub Pages: Settings → Pages → Custom domain
   - Vercel: Project settings → Domains → Add

4. **Wait for DNS propagation** (5-30 minutes)

5. **✅ Done!** HTTPS automatically enabled

---

### Option 2: Separate Domain

**Setup: `sesecpartners.org`**

1. **Register domain** (Google Domains, Namecheap, etc.)

2. **Point to hosting:**
   - **Netlify:** Use Netlify DNS (easiest)
   - **GitHub Pages:** A records to GitHub IPs
   - **Vercel:** Use Vercel DNS

3. **In hosting dashboard:**
   - Add domain
   - Follow verification steps
   - HTTPS auto-enabled

---

## 🔒 Security Best Practices

### HTTPS (Required)

All modern hosts provide free HTTPS:
- ✅ Netlify: Automatic with Let's Encrypt
- ✅ GitHub Pages: Automatic
- ✅ Vercel: Automatic

**Force HTTPS:**
- Netlify: Enabled by default
- GitHub Pages: Check "Enforce HTTPS" in settings
- Vercel: Enabled by default

### Security Headers

Already configured in `netlify.toml` and `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled

---

## 📊 Performance Optimization

### Already Optimized

✅ No build step needed
✅ Minification not required (vanilla JS is small)
✅ CSS and JS are cached (1 year)
✅ CSV data cached (1 hour)
✅ Global CDN distribution

### Optional Enhancements

**Add these if needed:**

1. **Image Optimization** (if you add images)
   ```bash
   # Use ImageOptim or similar
   ```

2. **Compression**
   - Netlify/Vercel: Automatic gzip/brotli
   - GitHub Pages: Automatic compression

3. **Analytics** (optional)
   ```html
   <!-- Add to index.html before </body> -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## 🔄 Updating the Live Site

### Method 1: Via Git (Recommended)

```bash
# Make changes locally
# Edit data/partners.csv or code files

# Commit changes
git add .
git commit -m "Update partner data"

# Push to GitHub
git push origin main

# ✅ Site updates automatically (30-60 seconds)
```

### Method 2: Direct File Upload (Netlify)

1. Log into Netlify
2. Open your site
3. Go to "Deploys"
4. Drag and drop updated folder
5. ✅ Instant deploy

### Method 3: CSV File Only (Quick Update)

1. Edit `data/partners.csv` on GitHub directly
2. Click "Edit" → Make changes → Commit
3. ✅ Site updates automatically

---

## 🐛 Troubleshooting

### CSV File Not Loading

**Problem:** "Failed to load partner data"

**Solutions:**
- ✅ Check `data/partners.csv` exists
- ✅ Verify CSV is properly formatted (UTF-8)
- ✅ Check browser console for errors
- ✅ Test locally with `python3 -m http.server`

### Site Not Updating

**Problem:** Changes not appearing

**Solutions:**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check deployment status on hosting dashboard
- Verify git push succeeded
- Check for build errors

### Custom Domain Not Working

**Problem:** Domain shows error or doesn't load

**Solutions:**
- Wait 30 minutes for DNS propagation
- Verify DNS records are correct
- Check SSL certificate status
- Try https:// explicitly

### 404 Errors

**Problem:** Refreshing page shows 404

**Solutions:**
- Check `netlify.toml` or `vercel.json` is deployed
- Verify redirect rules are set up
- For GitHub Pages: ensure all files are committed

---

## 📈 Monitoring

### Uptime Monitoring (Free Options)

**UptimeRobot** (free)
- Monitor every 5 minutes
- Email alerts if down
- uptime robot.com

**Pingdom** (free tier)
- pingdom.com

### Analytics

**Google Analytics** (free)
- See visitor stats
- Track search terms
- analytics.google.com

**Simple Analytics** (privacy-focused)
- GDPR compliant
- No cookies
- simpleanalytics.com

---

## 💰 Cost Estimate

### Free Forever (Recommended)

**Netlify Free:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ HTTPS included
- ✅ More than enough for this project

**GitHub Pages:**
- ✅ Unlimited for public repos
- ✅ 100GB bandwidth/month
- ✅ HTTPS included

**Vercel Free:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited personal projects
- ✅ HTTPS included

### If You Exceed Free Limits

**Unlikely unless:**
- Getting 100,000+ monthly visitors
- Serving large video files

**Paid Plans:**
- Netlify Pro: $19/month (1TB bandwidth)
- Vercel Pro: $20/month (1TB bandwidth)
- GitHub Enterprise: Not needed

---

## 🎓 Learning Resources

### Git Basics
- [GitHub Hello World](https://guides.github.com/activities/hello-world/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

### Deployment Platforms
- [Netlify Docs](https://docs.netlify.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)

### DNS & Domains
- [DNS Made Easy](https://dnsmadeeasy.com/support/learning-center/)
- [Cloudflare Learning](https://www.cloudflare.com/learning/)

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Site deployed and accessible
- [ ] HTTPS working
- [ ] All 57 partners loading correctly
- [ ] Search and filters working
- [ ] Mobile responsive (test on phone)
- [ ] Custom domain configured (if using)
- [ ] Contact info updated in footer
- [ ] Analytics added (optional)
- [ ] Team has access to hosting dashboard
- [ ] Backup of CSV data saved
- [ ] Documentation updated with live URL

---

## 📞 Getting Help

**Deployment Issues:**
- Netlify Support: [netlify.com/support](https://netlify.com/support)
- GitHub Discussions: Your repo → Discussions
- Vercel Support: [vercel.com/support](https://vercel.com/support)

**Technical Questions:**
- Create issue in your GitHub repo
- Email technical contact

**Data Updates:**
- Email [contact@sesecwa.org]

---

## 🎉 You're Ready to Deploy!

**Recommended Path:**
1. Push to GitHub (10 minutes)
2. Deploy to Netlify (5 minutes)
3. Configure custom domain (30 minutes)
4. Share with team ✅

**Total Time: ~45 minutes for complete setup**

---

**Questions?** Create an issue or email for help!

**Last Updated:** March 2026
