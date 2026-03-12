# Google Maps API Setup Guide

## Overview
The SESEC Partner Map now uses Google Maps for the interactive map view. To enable this feature, you need a Google Maps API key.

## Why Google Maps?
- **Better UX**: More familiar interface for most users
- **Street View**: Integrated street view for partner locations
- **Directions**: Users can get directions to partners
- **Better Mobile**: Touch-optimized map controls
- **Geocoding**: Can automatically geocode new addresses

## Free Tier
Google Maps offers a **$200/month free credit** which covers:
- **28,000+ map loads per month** (plenty for SESEC's use case)
- Dynamic maps, geocoding, and places API
- No upfront costs

For a nonprofit site like SESEC Partner Map with moderate traffic, you'll likely **stay within the free tier**.

---

## Step 1: Get a Google Cloud Account

1. Go to: https://console.cloud.google.com/
2. Sign in with a Google account (create one if needed)
3. Accept terms of service

---

## Step 2: Create a New Project

1. Click the project dropdown (top left)
2. Click "New Project"
3. Name it: `SESEC Partner Map`
4. Click "Create"
5. Wait for project to be created (~30 seconds)

---

## Step 3: Enable Google Maps JavaScript API

1. Go to: https://console.cloud.google.com/apis/library
2. Search for: "Maps JavaScript API"
3. Click on it
4. Click "Enable"
5. Wait for it to enable (~1 minute)

---

## Step 4: Create API Key

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "API Key"
3. Your API key will be generated (looks like: `AIzaSyB...`)
4. **Copy this key** - you'll need it next

---

## Step 5: Restrict Your API Key (IMPORTANT for Security)

1. In the credentials page, click on your API key name
2. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Click "Add an item"
   - Add these referrers:
     ```
     https://sprightly-semifreddo-4084a4.netlify.app/*
     http://localhost:8000/*
     http://localhost:8001/*
     ```
3. Under "API restrictions":
   - Select "Restrict key"
   - Check: "Maps JavaScript API"
4. Click "Save"

---

## Step 6: Add API Key to Your Site

### For Local Development:

1. Open `index.html` in your code editor
2. Find this line (near the bottom):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=Function.prototype" async defer></script>
   ```
3. Replace `YOUR_API_KEY` with your actual API key:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB...&callback=Function.prototype" async defer></script>
   ```
4. Save the file

### For Production (Netlify):

**Option A: Environment Variable (Recommended)**

1. In Netlify dashboard, go to: Site settings → Environment variables
2. Add variable:
   - Key: `GOOGLE_MAPS_API_KEY`
   - Value: Your API key
3. Update `index.html` to use:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=Function.prototype" async defer></script>
   ```

**Option B: Direct (Easier but less secure)**

Same as local development - just put the key directly in `index.html`.

---

## Step 7: Test the Map

1. **Local test:**
   ```bash
   cd ~/Desktop/SESEC/sesec-partner-map-app
   python3 -m http.server 8000
   ```
   Open: http://localhost:8000
   Click "🗺️ Map" button

2. **Production test:**
   - Push changes to GitHub
   - Wait for Netlify deploy (~30 seconds)
   - Visit your site and test map view

---

## Monitoring Usage

1. Go to: https://console.cloud.google.com/google/maps-apis/metrics
2. View daily map loads
3. Check if you're approaching the free tier limit

**For SESEC:** With estimated 100-500 visitors/month viewing the map, you'll use:
- ~1,500-7,500 map loads/month
- **Well within the 28,000 free monthly limit** ✅

---

## Troubleshooting

### "Google Maps library not loaded" error
- **Solution**: Check that your API key is correctly added to `index.html`
- Make sure there are no spaces or typos in the key

### Map shows gray screen
- **Solution**: API key restrictions might be too strict
- Temporarily remove restrictions to test
- Then add back your site's domain

### "This page can't load Google Maps correctly"
- **Solution**: Maps JavaScript API might not be enabled
- Go to: https://console.cloud.google.com/apis/library
- Search "Maps JavaScript API" and enable it

### Billing warning
- **Solution**: Set up a budget alert at $50 to get notified
- SESEC should never hit this with normal traffic
- Can always downgrade or disable if concerned

---

## Alternative: Keep Leaflet (Free)

If you prefer to avoid Google Maps entirely:

1. Keep using OpenStreetMap with Leaflet (current setup)
2. Advantages:
   - Completely free (no API key needed)
   - No usage limits
   - Open source
   - Privacy-friendly (no Google tracking)

3. To revert to Leaflet:
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Cost Comparison

| Feature | Google Maps | Leaflet + OSM |
|---------|-------------|---------------|
| **Cost** | Free tier ($200/month) | Completely free |
| **Monthly limit** | 28,000 map loads | Unlimited |
| **API Key** | Required | Not required |
| **Street View** | ✅ Included | ❌ Not available |
| **Directions** | ✅ Built-in | ❌ Requires 3rd party |
| **Mobile UX** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Familiar UI** | ✅ Most users know it | Less familiar |
| **Privacy** | Tracks users | No tracking |

---

## Recommendation

**For SESEC Partner Map:**
- **Use Google Maps** if you want the best UX and have someone who can manage the API key
- **Keep Leaflet** if you want zero maintenance and complete privacy

Both work great - it's a preference choice! The code is set up to easily switch between them.

---

## Support

- **Google Maps Documentation**: https://developers.google.com/maps/documentation
- **Billing Help**: https://cloud.google.com/billing/docs
- **API Key Security**: https://developers.google.com/maps/api-security-best-practices

---

**Last Updated:** March 2026
