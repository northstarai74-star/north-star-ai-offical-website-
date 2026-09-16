# North Star AI Website

The official website for North Star AI - AI Receptionist for UK Dental Clinics.

## Project Overview

This is a high-performance, SEO-optimized landing page for North Star AI's AI receptionist service. Built with vanilla HTML/CSS/JavaScript for maximum speed and minimal dependencies.

**Live Site:** https://northstarai.co.uk/

## Quick Start

### Run Locally
```bash
npm install
npm start
```

Server runs on http://localhost:3000

### File Structure
```
├── index.html              # Main landing page (100% SEO score)
├── demo-booking.html       # Demo booking page
├── resources.html          # Resources & blog page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── logo.svg                # Brand logo
├── robots.txt              # Search engine crawler directives
├── sitemap.xml             # XML sitemap for SEO
├── sitemap.json            # Alternative JSON sitemap
├── seo-agent.js            # Automated SEO testing tool
├── server.js               # Express.js server
├── package.json            # Dependencies
├── SEO.md                  # SEO strategy & guidelines
├── SEO-AUDIT-CHECKLIST.md  # SEO implementation checklist
├── SEO-AGENT-GUIDE.md      # How to use the SEO testing tool
├── ANALYTICS-SETUP.md      # Analytics & conversion tracking guide
└── META-TAGS-TEMPLATE.html # Reference for meta tags
```

## Key Features

### 🎨 Design
- Dark theme optimized for tech industry
- Fully responsive mobile design
- Smooth animations and transitions
- Custom card carousel component
- Brand-consistent color scheme

### ⚡ Performance
- **Page Size:** < 100KB (index.html)
- **Load Time:** < 2 seconds
- **Lighthouse Score:** 90+
- **Core Web Vitals:** All green

### 🔍 SEO
- **SEO Score:** 100% (93/93 checks)
- **Structured Data:** Complete schema markup
- **Open Graph:** Social media optimization
- **Sitemap:** Auto-updated XML + JSON
- **robots.txt:** Proper crawl directives

### 📱 Responsive
- Mobile-first design
- Breakpoints: 600px, 1200px
- Touch-friendly buttons
- Optimized form inputs

### ♿ Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Alt text on all images

## Content Pages

### 1. Home (index.html)
- Hero section with value proposition
- Feature showcase (Bento grid)
- How it works explanation
- Pricing options
- Testimonials carousel
- FAQ section (7 questions)
- CTA buttons throughout

### 2. Demo Booking (demo-booking.html)
- Lead capture form
- Demo scheduling interface
- Quote calculator
- Trust signals

### 3. Resources (resources.html)
- Blog/resource hub
- Case studies
- Guides and whitepapers
- Coming soon - expandable section

### 4. Legal Pages
- **Privacy Policy** (privacy.html)
- **Terms of Service** (terms.html)
- Both fully compliant with UK law

## SEO Implementation

### Current Status ✅
- **100% SEO Score** - All checks passing
- **0 Critical Issues** - Production ready
- **FAQ Schema** - Rich snippets enabled
- **Open Graph** - Social sharing optimized
- **Mobile Friendly** - All pages responsive

### SEO Files
- **SEO.md** - Complete strategy document
- **SEO-AUDIT-CHECKLIST.md** - Progress tracker
- **SEO-AGENT-GUIDE.md** - Testing tool documentation
- **seo-agent.js** - Automated SEO validator

### Run SEO Audit
```bash
node seo-agent.js
```

Expected output: 100% score (93/93 checks)

## Analytics & Tracking

### Setup Required
1. Create Google Analytics 4 account
2. Get Measurement ID (starts with G-)
3. Replace `GA_ID` in index.html:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
```

### Tracking Events
- Demo booking conversions
- FAQ engagement
- CTA clicks
- Page views
- User behavior

**See:** ANALYTICS-SETUP.md for full guide

## Development Guide

### Making Updates

#### Editing Page Content
1. Open relevant HTML file
2. Update content while preserving structure
3. Test responsiveness at 360px, 768px, 1200px
4. Run SEO audit: `node seo-agent.js`
5. Check for broken links

#### Adding New Content
1. Create new section in HTML
2. Match existing color scheme and typography
3. Add proper semantic HTML
4. Test on mobile and desktop
5. Update sitemap.xml
6. Update navigation links
7. Re-run SEO audit

#### Styling
- Use CSS variables (see `:root` in style)
- Keep classes minimal and semantic
- Test dark theme rendering
- Check mobile touch targets (min 48px)

### Color Palette
```
Background: #0a0f1e
Card: #111a30
Text: #ffffff
Muted: rgba(255,255,255,.62)
Primary Blue: #2d6bff
Accent Cyan: #37cdfb
Border: rgba(101,130,200,.28)
```

## Testing

### SEO Testing
```bash
node seo-agent.js
```
Validates: titles, descriptions, meta tags, schema, images, links, speed, etc.

### Manual Testing
- [ ] Open index.html in browser
- [ ] Check all links work
- [ ] Test form submission
- [ ] Check mobile responsiveness
- [ ] Verify images load
- [ ] Test keyboard navigation
- [ ] Check Google Analytics loads

### Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 12+)

## Deployment

### Via Vercel (Recommended)
1. Connect GitHub repo
2. Set build command: `npm run build` (if needed)
3. Deploy automatically on push
4. Vercel handles SSL, CDN, analytics

### Via Server
```bash
npm install
npm start
```

Runs on port 3000 by default.

### Environment Variables
Create `.env.local` for development:
```
NODE_ENV=production
PORT=3000
```

## Performance Optimization

### Current Metrics
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

### Optimization Tips
- Keep HTML/CSS/JS minified
- Optimize images (use WebP where possible)
- Lazy load non-critical resources
- Use CSS variables for theme
- Avoid render-blocking scripts

## Security

### HTTPS ✅
All pages served over HTTPS

### Security Headers ✅
- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy

### Privacy ✅
- GDPR compliant
- Privacy policy included
- Terms of service included
- No tracking cookies (unless configured)

## Maintenance

### Monthly Tasks
1. Check for broken links
2. Run SEO audit (`node seo-agent.js`)
3. Review Google Analytics
4. Check Google Search Console
5. Update meta descriptions if needed
6. Monitor Core Web Vitals

### Quarterly Tasks
1. Audit and update content
2. Review competitor pages
3. Update case studies/testimonials
4. Optimize underperforming pages
5. Plan new content

### Annual Tasks
1. Security audit
2. Performance audit
3. Design refresh (if needed)
4. Rebrand/update messaging
5. Plan roadmap

## Keywords & SEO Strategy

### Primary Keywords
- AI receptionist UK
- Dental AI receptionist
- Automated appointment booking
- 24/7 dental calls
- Voicemail elimination

### Secondary Keywords
- Dental practice management
- AI for dentists
- Patient scheduling
- Dental technology
- Call answering service

### Long-tail Keywords
- "AI receptionist for small dental practices UK"
- "How to stop missing patient calls"
- "Free dental appointment booking system"
- "Best UK dental practice software"

## Content Calendar

### Q4 2026 Plan
- [ ] Publish "Cost of Missed Calls" guide
- [ ] Create dental industry case study
- [ ] Develop integration guide for Dentally
- [ ] Launch email sequence

### Q1 2027 Plan
- [ ] Blog on patient experience trends
- [ ] Webinar on AI in dentistry
- [ ] Whitepaper on automation ROI
- [ ] Partnership announcements

## Support & Resources

### Documentation
- SEO.md - Complete SEO strategy
- SEO-AUDIT-CHECKLIST.md - Progress tracking
- ANALYTICS-SETUP.md - Analytics guide
- META-TAGS-TEMPLATE.html - Meta tag reference

### Tools
- seo-agent.js - Automated SEO testing
- robots.txt - Crawler directives
- sitemap.xml - Search engine sitemap

### External Resources
- Google Search Central: https://developers.google.com/search
- Web.dev: https://web.dev/
- Schema.org: https://schema.org/

## Troubleshooting

### Page Not Loading
1. Check internet connection
2. Clear browser cache
3. Try different browser
4. Check server logs

### Links Broken
1. Run SEO audit to find broken links
2. Update 404 links in HTML
3. Test all internal links
4. Check external links quarterly

### Analytics Not Working
1. Verify GA ID is correct
2. Check GA tag is in page source
3. Check for browser extensions blocking GA
4. Wait 24-48 hours for data
5. See ANALYTICS-SETUP.md for troubleshooting

## Contributing

### Process
1. Create branch: `feature/your-feature`
2. Make changes
3. Test thoroughly
4. Run SEO audit
5. Create pull request
6. Get review
7. Merge to main

### Commit Messages
- `feat: add new feature`
- `fix: fix specific bug`
- `docs: update documentation`
- `style: update styling/UI`
- `refactor: improve code quality`
- `perf: optimize performance`

## License

© 2026 North Star AI. All rights reserved.

## Contact

- **Website:** https://northstarai.co.uk/
- **Email:** [contact email]
- **Demo:** https://northstarai.co.uk/demo-booking.html

---

**Last Updated:** 2026-09-16  
**Status:** Production Ready ✅  
**SEO Score:** 100%  
**Performance Score:** 95+  
