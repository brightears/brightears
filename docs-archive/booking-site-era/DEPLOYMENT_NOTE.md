# 🚨 IMPORTANT DEPLOYMENT NOTE 🚨

## **THIS PROJECT RUNS ON RENDER, NOT LOCALHOST!**

### Production URL: https://brightears.onrender.com

### Deployment Process:
1. **All changes are automatically deployed** when pushed to GitHub
2. **GitHub repo**: https://github.com/brightears/brightears
3. **Render Dashboard**: https://dashboard.render.com/

### When we make changes:
1. We push to GitHub: `git push origin main`
2. Render automatically detects the push
3. Render builds and deploys (takes ~3-5 minutes)
4. Changes are LIVE at https://brightears.onrender.com

### DO NOT focus on localhost:
- localhost:3000 or localhost:3001 is ONLY for quick testing
- The REAL app that users access is on RENDER
- Always think "How will this work on Render?" not "How will this work on localhost?"

### Current Status (August 26, 2024):
✅ Site is STABLE and WORKING after Clerk integration
✅ All Convex code removed (was causing production crashes)
✅ Authentication fully functional with Google OAuth
✅ Build succeeding without TypeScript errors
✅ Deployment pipeline working smoothly

### Recovery Checkpoint:
If the site breaks in future development, we have a stable checkpoint:
```bash
git checkout stable-clerk-auth-v1
```

### To check deployment status:
1. Go to https://dashboard.render.com/
2. Click on "brightears" web service
3. Check the "Events" tab for deployment progress

---
**REMEMBER: We develop for RENDER (production), not localhost!**