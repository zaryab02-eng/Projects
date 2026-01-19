# Pre-Deployment Checklist for iOS Safari Fix

## Before Committing

### 1. Verify All Media Files Exist ✅
Run this in terminal from project root:
```bash
ls -lh public/sounds/
ls -lh public/videos/
```

Expected files:
- `public/sounds/final.mp3` ✅
- `public/sounds/unlock.mp3` ✅
- `public/sounds/wrong.mp3` ✅
- `public/videos/background.mp4` ✅
- `public/videos/final.mp4` ✅
- `public/videos/level1.mp4` ✅
- `public/videos/wrong.mp4` ✅

### 2. Check Video Format Compatibility
Verify videos are Safari-compatible:
```bash
# On Mac/Linux with ffmpeg installed
ffmpeg -i public/videos/background.mp4 2>&1 | grep -E "Video:|Audio:"
```

Safari Requirements:
- Video codec: H.264
- Audio codec: AAC
- Container: MP4

### 3. Test Build Locally
```bash
npm run build
npm run preview
```

Open in browser and check:
- No console errors
- Videos load (or fail gracefully)
- Audio plays (or fails gracefully)
- App remains functional

## After Deploying to Vercel

### 1. Verify HTTPS URLs
All assets should be served via HTTPS:
- `https://your-domain.vercel.app/videos/background.mp4`
- `https://your-domain.vercel.app/sounds/unlock.mp3`

### 2. Check Response Headers
```bash
curl -I https://your-domain.vercel.app/videos/background.mp4
```

Expected headers:
- `Content-Type: video/mp4`
- `Accept-Ranges: bytes`
- `Strict-Transport-Security: max-age=63072000`

### 3. Test on Real iPhone
**CRITICAL**: Simulator is NOT enough!

Steps:
1. Open Safari on iPhone
2. Go to your Vercel URL
3. Play the game
4. Check for errors

### 4. Debug on iOS Safari (if needed)

On iPhone:
- Settings → Safari → Advanced → Enable "Web Inspector"

On Mac:
- Safari → Develop → [Your iPhone] → [Your Website]
- Check Console and Network tabs

## Common Issues & Solutions

### Issue: "TLS Error" Still Appears
**Cause**: Media file request failing  
**Debug**: 
1. Check Network tab in Safari Inspector
2. Look for 404 or 5xx errors on media files
3. Verify file exists on Vercel deployment

**Fix**: 
- Ensure media files are in `public/` folder
- Re-deploy to Vercel
- Check build includes media files

### Issue: Black Screen, No Video
**Cause**: Safari autoplay blocked  
**Expected**: This is normal! App should continue without video  
**Verify**: Check console for "autoplay prevented" message

### Issue: No Sound
**Cause**: Safari requires user interaction for audio  
**Expected**: First sound might not play  
**Workaround**: Subsequent sounds after user interaction should work

### Issue: Video Plays but Audio Doesn't
**Cause**: Video muted (required for autoplay)  
**Expected**: Background videos are muted intentionally

## Performance Verification

### Check Lighthouse Score (Mobile)
```bash
npm run build
npx lighthouse https://your-domain.vercel.app --view
```

Target scores:
- Performance: >80
- Accessibility: >90
- Best Practices: >90
- SEO: >80

### Check Network Usage
In Safari Inspector → Network tab:
- Total page weight: <5MB initial load
- Video streaming: Should use range requests
- Audio files: <1MB each

## Security Verification

### 1. Check CSP Headers
```bash
curl -I https://your-domain.vercel.app | grep -i "content-security"
```

### 2. Verify HTTPS Redirect
```bash
curl -I http://your-domain.vercel.app
```
Should redirect to HTTPS (301 or 302)

### 3. Check Mixed Content
In browser console, no warnings like:
- "Mixed Content: The page was loaded over HTTPS, but requested an insecure resource"

## Final Pre-Launch Checklist

- [ ] All media files exist and are committed
- [ ] Local build works without errors
- [ ] Vercel deployment successful
- [ ] HTTPS URLs working for all assets
- [ ] Tested on real iPhone (not simulator)
- [ ] No console errors in Safari Inspector
- [ ] App loads even if media fails
- [ ] Gameplay functional without videos/audio
- [ ] No mixed content warnings
- [ ] Lighthouse scores acceptable

## Rollback Plan

If critical issues found after deployment:

1. **Quick Fix**: Disable media loading
   - Set `videoError` state to `true` by default
   - Comment out video elements temporarily

2. **Full Rollback**: Revert to previous Vercel deployment
   - Vercel Dashboard → Deployments → Previous → Promote

3. **Debug**: Use Safari Inspector on iPhone to identify issue
   - Check Console for errors
   - Check Network for failed requests
   - Check Application for service worker issues

## Post-Deployment Monitoring

### First 24 Hours
Monitor for:
- Error rate increase
- User reports of loading issues
- Safari-specific error logs

### Week 1
- User feedback on iOS
- Analytics for iOS Safari bounce rate
- Check if iOS completion rate matches Android

## Success Criteria

✅ App loads on iOS Safari without TLS error  
✅ No JavaScript errors in Safari console  
✅ Gameplay functional even if media fails  
✅ Videos play when autoplay is allowed  
✅ Audio plays after user interaction  
✅ Performance acceptable on older iPhones  
✅ No mixed content warnings  
✅ All assets served over HTTPS  

---

**Last Updated**: 2026-01-19  
**Version**: 1.0 - Initial Safari Fix
