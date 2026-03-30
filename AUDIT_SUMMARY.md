# Asina Disability Support Website - Complete Audit Report

**Audit Date:** March 30, 2026
**Scope:** Images, Sitemap, and Robots.txt

---

## Executive Summary

The Asina Disability Support website is well-maintained with excellent accessibility standards and proper SEO configuration. There are no critical issues, but some medium and low-priority optimizations are recommended.

### Overall Score
- **Accessibility:** A+ (Excellent alt text on all images)
- **SEO:** A (Complete sitemap, proper robots.txt)
- **Performance:** B (Some missing width/height attributes causing potential layout shift)

---

## Part 1: Image Audit

### Issues Found

#### 1. Missing Width/Height Attributes (MEDIUM - 50 images)
**Impact:** Cumulative Layout Shift (CLS), poor page performance scores

**Most affected:**
- `blog/index.html` - 12 images
- `services.html` - 8 images
- `services/*.html` - 32 images (4 per page across 8 service pages)

**Recommendation:** Add width and height attributes to all images to prevent layout shift.

#### 2. PNG/JPG Format Instead of WebP (LOW - 15+ images)
**Impact:** Larger file sizes, slower page load

**Primary culprit:** `asina-logo.png` appears on 50+ pages
- Converting this single file would fix most issues
- Also found: `gardenbed.jpg` in blog/index.html

**Recommendation:** Convert `asina-logo.png` to WebP format

#### 3. Missing Lazy Loading (LOW - 10-15 images)
**Impact:** Marginal performance impact

**Affected pages:** Various (mostly above-fold images, which is acceptable)

**Recommendation:** Consider adding loading="lazy" to below-fold images

### What's Working Well

✓ **Excellent Alt Text** - All 260+ images have descriptive, accessible alt text
✓ **Good Image Format Choice** - Majority of images already use WebP
✓ **Most Images Properly Sized** - 50% of pages have all images properly dimensioned

---

## Part 2: Sitemap Audit

### Status: EXCELLENT

✓ **Completeness:** 56 URLs included (all public pages accounted for)
✓ **Domain:** Correct domain (asinadisability.com.au) with HTTPS
✓ **Dates:** Proper ISO 8601 format with recent lastmod dates
✓ **Priorities:** Valid range (0.0-1.0) with reasonable distribution
✓ **Change Frequency:** Appropriate values (weekly/monthly/yearly)

### Minor Notes
- 404.html correctly excluded
- Root index.html correctly included as "/"
- /blog/feed.xml correctly included

---

## Part 3: Robots.txt Audit

### Status: EXCELLENT

✓ **Sitemap Reference:** Correct URL included
✓ **Allow/Disallow Rules:** Properly configured
✓ **Protected Pages:** Admin, portal, and internal pages correctly hidden
✓ **Public Content:** All customer-facing pages remain accessible

**Rules Summary:**
- Allow all content by default
- Block search parameter pages (/?s=)
- Hide: /portal, /app-signup, /email-signature, /admin

---

## Recommendations Priority List

### Priority 1: Medium Impact
**Add width/height attributes to images**
- Affects: 50 images across 9 files
- Benefit: Eliminates Cumulative Layout Shift
- Effort: Low (straightforward HTML edits)
- Timeline: 1-2 hours

### Priority 2: Low Impact
**Convert asina-logo.png to WebP**
- Affects: 50+ page loads
- Benefit: Reduces file size, improves page speed
- Effort: Very Low (single file conversion)
- Timeline: 15 minutes

### Priority 3: Minor
**Add lazy loading to selected images**
- Affects: 10-15 images
- Benefit: Marginal performance boost
- Effort: Low
- Timeline: 30 minutes

---

## Files Analyzed

**Total HTML Files:** 54 (excluding templates)
**Total Images:** 260+
**Files with Issues:**
- 9 files with missing width/height
- Multiple files with PNG format (mostly logos)
- 10-15 images missing lazy loading

---

## Conclusion

The website demonstrates strong attention to accessibility and SEO fundamentals. The identified issues are straightforward to fix and would improve Core Web Vitals scores. The sitemap and robots.txt are exemplary for an Australian small business website.

**No critical issues detected.**
**No public content is unintentionally blocked.**
**All images are properly labeled for accessibility.**

---

*This audit was conducted as a technical review of website structure and optimization. No changes were made during this audit.*
