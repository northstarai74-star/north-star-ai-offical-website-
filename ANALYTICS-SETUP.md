# North Star AI - Analytics & Conversion Tracking Setup

## Overview
This guide walks through setting up analytics, conversion tracking, and performance monitoring for the North Star AI website.

## Google Analytics 4 Setup

### 1. Create Google Analytics Account
1. Go to https://analytics.google.com/
2. Click "Start measuring"
3. Create new property "North Star AI Website"
4. Select platform: "Web"
5. Enter website: https://northstarai.co.uk/

### 2. Get Your Measurement ID
After creating the property:
1. Go to Admin → Property Settings
2. Copy the "Measurement ID" (starts with `G-`)
3. Replace `GA_ID` in index.html with your actual ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3. Key Events to Track

**Primary Conversions:**
- Demo booked (form submission)
- Call-to-action clicked
- Navigation to demo page

**Engagement Events:**
- Scroll depth
- FAQ accordion opens
- Video plays
- Link clicks

**Page Views:**
- Home page
- Demo booking page
- Resources page
- Privacy/Terms pages

## Google Search Console Setup

### 1. Add Property
1. Go to https://search.google.com/search-console/
2. Add property: https://northstarai.co.uk/
3. Verify ownership via HTML file upload or DNS record

### 2. Submit Sitemap
1. Go to Sitemaps section
2. Enter: `https://northstarai.co.uk/sitemap.xml`
3. Click Submit

### 3. Monitor Performance
- Check impressions and clicks
- Track keyword rankings
- Fix any crawl errors
- Monitor mobile usability

## Conversion Tracking

### Goal 1: Demo Booking
**Type:** Destination  
**URL:** `/demo-booking.html`  
**Value:** £50 (estimated lead value)  
**Conversion category:** Lead

### Goal 2: FAQ Engagement
**Type:** Event  
**Event name:** `faq_open`  
**Value:** £1 (engagement signal)  
**Conversion category:** Engagement

### Goal 3: Resource Download
**Type:** Event  
**Event name:** `resource_download`  
**Value:** £5 (lead indicator)  
**Conversion category:** Lead

## Event Tracking Code

Add these to track specific user actions:

### Track FAQ Opens
```javascript
document.querySelectorAll('[data-faq-toggle]').forEach(btn => {
  btn.addEventListener('click', function() {
    gtag('event', 'faq_open', {
      'event_category': 'engagement',
      'event_label': this.dataset.faqTopic
    });
  });
});
```

### Track CTA Clicks
```javascript
document.querySelectorAll('[data-loc]').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'cta_click', {
      'event_category': 'conversion',
      'event_label': this.dataset.loc || 'unknown',
      'value': 1
    });
  });
});
```

### Track Form Submissions
```javascript
document.getElementById('demo-form')?.addEventListener('submit', function(e) {
  gtag('event', 'form_submit', {
    'event_category': 'conversion',
    'event_label': 'demo_booking',
    'value': 50
  });
});
```

## Facebook Pixel Setup

### 1. Create Facebook Pixel
1. Go to https://facebook.com/ads/manager/
2. Go to Events Manager
3. Create new Web pixel
4. Get Pixel ID

### 2. Add Pixel Code
```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID'); // Replace with your Pixel ID
fbq('track', 'PageView');
</script>
```

### 3. Track Conversions
```javascript
// Track demo booking
fbq('track', 'Lead', {
  currency: 'GBP',
  value: 50.00
});
```

## Bing Webmaster Tools

### 1. Add Site
1. Go to https://www.bing.com/webmasters/
2. Add your website
3. Verify via DNS or XML file

### 2. Submit Sitemap
1. Go to Sitemaps section
2. Submit `https://northstarai.co.uk/sitemap.xml`

## Monthly Reporting Checklist

### Week 1: Analytics Review
- [ ] Check total sessions and users
- [ ] Review traffic sources (organic, direct, referral)
- [ ] Check bounce rate and avg session duration
- [ ] Identify top-performing pages

### Week 2: SEO Monitoring
- [ ] Check GSC impressions and clicks
- [ ] Monitor keyword rankings
- [ ] Check for crawl errors
- [ ] Review indexation status

### Week 3: Conversion Tracking
- [ ] Count conversions (demos booked)
- [ ] Calculate conversion rate
- [ ] Check lead quality
- [ ] Calculate cost per lead

### Week 4: Reporting
- [ ] Create monthly report
- [ ] Identify trends
- [ ] Set targets for next month
- [ ] Plan optimizations

## Key Performance Indicators (KPIs)

### Primary Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Monthly organic sessions | 150+ | - |
| Average session duration | 2+ min | - |
| Pages per session | 2+ | - |
| Bounce rate | < 60% | - |
| Conversion rate | 2%+ | - |
| Monthly demos booked | 5+ | - |

### Secondary Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Mobile traffic % | 50%+ | - |
| Referral traffic | 10%+ | - |
| Resource downloads | 10+ | - |
| FAQ engagement | 30%+ | - |
| Return visitor % | 20%+ | - |

## Optimization Opportunities

### Based on Analytics Data
1. **Low-traffic pages** - Improve SEO or consolidate content
2. **High bounce rate** - Improve page quality or relevance
3. **Low conversion rate** - Improve CTA clarity and positioning
4. **Mobile issues** - Fix mobile UX and responsiveness
5. **Traffic sources** - Double down on best-performing channels

## Tools & Resources

### Essential Tools (Free)
- Google Analytics 4: https://analytics.google.com/
- Google Search Console: https://search.google.com/search-console/
- Google PageSpeed Insights: https://pagespeed.web.dev/
- Bing Webmaster Tools: https://www.bing.com/webmasters/

### Recommended Tools (Paid)
- Ahrefs: Keyword research & backlink analysis
- SEMrush: Keyword research & competitor analysis
- HotJar: Session recordings & heatmaps
- Unbounce: Landing page optimization

## Privacy & Compliance

### GDPR Compliance
- [ ] Add cookie consent banner (required for EU visitors)
- [ ] Document data processing
- [ ] Add privacy policy (already done)
- [ ] Enable GDPR data anonymization in GA

### Privacy Settings in Google Analytics
1. Go to Admin → Data Settings
2. Enable "Anonymize IP addresses"
3. Set data retention: 14 months
4. Disable advertising features if needed

## Implementation Timeline

### Week 1: Setup
- [ ] Create GA4 account
- [ ] Add GA tracking code
- [ ] Verify GA is collecting data
- [ ] Add GSC property
- [ ] Submit sitemap to GSC

### Week 2: Advanced Setup
- [ ] Configure conversion goals
- [ ] Set up custom events
- [ ] Add Facebook Pixel (optional)
- [ ] Add Bing Pixel (optional)
- [ ] Set up dashboards

### Week 3: Monitoring
- [ ] Check data collection
- [ ] Verify conversions tracking
- [ ] Review reports
- [ ] Start keyword monitoring

### Week 4: Optimization
- [ ] Identify optimization opportunities
- [ ] Create action plan
- [ ] Begin A/B testing
- [ ] Plan content strategy

## Support & Troubleshooting

### Google Analytics Not Tracking
1. Check if GA tag is present in page source
2. Verify Measurement ID is correct
3. Check browser console for errors
4. Use GA Debugger Chrome extension
5. Wait 24-48 hours for first data to appear

### No Search Console Data
1. Ensure property is verified
2. Ensure sitemap was submitted
3. Check robots.txt allows indexing
4. Wait 2-4 weeks for data to populate
5. Request indexing in GSC

### Low Conversion Rate
1. Improve CTA visibility and clarity
2. Test different messaging
3. Check form is working
4. Improve page speed
5. Reduce form fields

## Next Steps

1. Set up GA4 account this week
2. Implement tracking code on all pages
3. Verify data collection after 24 hours
4. Set up conversion goals
5. Monitor for 2-4 weeks before analyzing trends
6. Create monthly reporting process
7. Implement optimizations based on data

---

**Last Updated:** 2026-09-16
**Status:** Ready for implementation
