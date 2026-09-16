#!/usr/bin/env node

/**
 * North Star AI - SEO Testing Agent
 * Comprehensive SEO validation and analysis tool
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

class SEOAgent {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      pages: {},
    };
    this.pages = ['index.html', 'demo-booking.html', 'privacy.html', 'terms.html'];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  header(text) {
    this.log(`\n${'='.repeat(60)}`, 'bold');
    this.log(text, 'cyan');
    this.log(`${'='.repeat(60)}\n`, 'bold');
  }

  section(text) {
    this.log(`\n▶ ${text}`, 'bold');
    this.log('-'.repeat(50));
  }

  pass(message) {
    this.log(`✓ ${message}`, 'green');
    this.results.passed++;
  }

  fail(message) {
    this.log(`✗ ${message}`, 'red');
    this.results.failed++;
  }

  warn(message) {
    this.log(`⚠ ${message}`, 'yellow');
    this.results.warnings++;
  }

  info(message) {
    this.log(`ℹ ${message}`, 'blue');
  }

  parseHTML(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Simple HTML parsing without cheerio dependency
      return {
        raw: content,
        $: content, // Store raw for regex-based checking
      };
    } catch (error) {
      this.fail(`Could not read file: ${filePath}`);
      return null;
    }
  }

  extractMetaTag(html, name) {
    const regex = new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  }

  extractTag(html, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }

  countTag(html, tag) {
    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = html.match(regex);
    return matches ? matches.length : 0;
  }

  testTitleTag(html, fileName) {
    const title = this.extractTag(html, 'title');

    if (!title) {
      this.fail(`${fileName}: Missing title tag`);
      return;
    }

    const length = title.length;
    if (length < 30) {
      this.warn(`${fileName}: Title too short (${length}). Recommended: 50-60 characters`);
    } else if (length > 60) {
      this.warn(`${fileName}: Title too long (${length}). Recommended: 50-60 characters`);
    } else {
      this.pass(`${fileName}: Title tag optimal length (${length} chars)`);
    }

    if (!title.includes('North Star AI')) {
      this.warn(`${fileName}: Title doesn't include brand name`);
    } else {
      this.pass(`${fileName}: Title includes brand name`);
    }
  }

  testMetaDescription(html, fileName) {
    const description = this.extractMetaTag(html, 'description');

    if (!description) {
      this.fail(`${fileName}: Missing meta description`);
      return;
    }

    const length = description.length;
    if (length < 120) {
      this.warn(`${fileName}: Meta description too short (${length}). Recommended: 155-160 characters`);
    } else if (length > 160) {
      this.warn(`${fileName}: Meta description too long (${length}). Recommended: 155-160 characters`);
    } else {
      this.pass(`${fileName}: Meta description optimal length (${length} chars)`);
    }
  }

  testOpenGraph(html, fileName) {
    const ogTitle = this.extractMetaTag(html, 'og:title');
    const ogDescription = this.extractMetaTag(html, 'og:description');
    const ogUrl = this.extractMetaTag(html, 'og:url');
    const ogImage = this.extractMetaTag(html, 'og:image');

    const ogTests = [
      { tag: 'og:title', value: ogTitle },
      { tag: 'og:description', value: ogDescription },
      { tag: 'og:url', value: ogUrl },
      { tag: 'og:image', value: ogImage },
    ];

    let ogCount = 0;
    ogTests.forEach(test => {
      if (test.value) {
        this.pass(`${fileName}: ${test.tag} present`);
        ogCount++;
      } else {
        this.warn(`${fileName}: ${test.tag} missing`);
      }
    });

    if (ogCount === 4) {
      this.pass(`${fileName}: Complete Open Graph tags`);
    }
  }

  testCanonical(html, fileName) {
    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

    if (!canonical) {
      this.warn(`${fileName}: Canonical URL missing`);
    } else {
      this.pass(`${fileName}: Canonical URL present (${canonical[1]})`);
    }
  }

  testHeadingStructure(html, fileName) {
    const h1Count = this.countTag(html, 'h1');
    const h2Count = this.countTag(html, 'h2');
    const h3Count = this.countTag(html, 'h3');

    if (h1Count === 0) {
      this.fail(`${fileName}: Missing H1 tag`);
    } else if (h1Count === 1) {
      this.pass(`${fileName}: Single H1 tag (correct)`);
    } else {
      this.fail(`${fileName}: Multiple H1 tags (${h1Count}). Should have only 1`);
    }

    if (h2Count > 0) {
      this.pass(`${fileName}: ${h2Count} H2 tag(s) found`);
    }

    if (h3Count > 0) {
      this.pass(`${fileName}: ${h3Count} H3 tag(s) found`);
    }
  }

  testMetaTags(html, fileName) {
    const charset = html.match(/<meta\s+charset=["']?([^"'>\s]+)/i);
    const viewport = html.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']*)["']/i);
    const robots = this.extractMetaTag(html, 'robots');
    const language = html.match(/<html\s+lang=["']?([^"'>\s]+)/i);

    if (charset) {
      this.pass(`${fileName}: Charset meta tag present`);
    } else {
      this.fail(`${fileName}: Missing charset meta tag`);
    }

    if (viewport) {
      this.pass(`${fileName}: Viewport meta tag present`);
    } else {
      this.fail(`${fileName}: Missing viewport meta tag (critical for mobile)`);
    }

    if (language) {
      this.pass(`${fileName}: Language attribute present (${language[1]})`);
    } else {
      this.warn(`${fileName}: Missing language attribute on html tag`);
    }

    if (robots) {
      this.pass(`${fileName}: Robots meta tag configured`);
    } else {
      this.info(`${fileName}: No robots meta tag (using robots.txt default)`);
    }
  }

  testImages(html, fileName) {
    const imgRegex = /<img[^>]*>/gi;
    const images = html.match(imgRegex) || [];

    if (images.length === 0) {
      this.info(`${fileName}: No images to check`);
      return;
    }

    let imagesWithAlt = 0;
    images.forEach((img, index) => {
      if (/alt=["'][^"']*["']/i.test(img)) {
        imagesWithAlt++;
      }
    });

    if (imagesWithAlt === images.length) {
      this.pass(`${fileName}: All ${images.length} images have alt text`);
    } else {
      this.fail(`${fileName}: ${images.length - imagesWithAlt}/${images.length} images missing alt text`);
    }
  }

  testStructuredData(html, fileName) {
    const schemaScript = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);

    if (!schemaScript) {
      this.warn(`${fileName}: No structured data (Schema.org) found`);
      return;
    }

    try {
      const schema = JSON.parse(schemaScript[1]);
      const type = schema['@type'];
      this.pass(`${fileName}: Structured data found (@type: ${type})`);

      if (schema.name) {
        this.pass(`${fileName}: Schema has name property`);
      }
      if (schema.description) {
        this.pass(`${fileName}: Schema has description property`);
      }
    } catch (error) {
      this.fail(`${fileName}: Invalid structured data JSON`);
    }
  }

  testInternalLinks(html, fileName) {
    const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
    const internalLinks = [];
    let match;

    while ((match = aRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].trim();

      if (href.includes(fileName)) continue; // Skip self-links

      if (!href.startsWith('http') && !href.startsWith('//')) {
        internalLinks.push({ href, text });
      }
    }

    if (internalLinks.length > 0) {
      this.pass(`${fileName}: ${internalLinks.length} internal links found`);
    } else {
      this.info(`${fileName}: No internal links found`);
    }
  }

  testPageSize(html, fileName) {
    const sizeKB = Buffer.byteLength(html, 'utf-8') / 1024;

    if (sizeKB > 500) {
      this.fail(`${fileName}: Large page size (${sizeKB.toFixed(1)} KB). Should be < 500 KB`);
    } else if (sizeKB > 250) {
      this.warn(`${fileName}: Page size is ${sizeKB.toFixed(1)} KB. Optimize for performance`);
    } else {
      this.pass(`${fileName}: Good page size (${sizeKB.toFixed(1)} KB)`);
    }
  }

  testHTMLValidation(html) {
    const issues = [];

    // Check for common issues
    if (!html.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE declaration');
    }

    if (!html.includes('<html')) {
      issues.push('Missing html tag');
    }

    if (!html.includes('<head')) {
      issues.push('Missing head tag');
    }

    if (!html.includes('<body')) {
      issues.push('Missing body tag');
    }

    return issues;
  }

  testRobotsFile() {
    this.section('Testing robots.txt');

    try {
      const robots = fs.readFileSync('robots.txt', 'utf-8');

      if (robots.includes('User-agent:')) {
        this.pass('robots.txt: User-agent directive present');
      } else {
        this.fail('robots.txt: Missing User-agent directive');
      }

      if (robots.includes('Sitemap:')) {
        this.pass('robots.txt: Sitemap directive present');
      } else {
        this.warn('robots.txt: No Sitemap directive (recommended)');
      }

      if (robots.includes('Allow:') || robots.includes('Disallow:')) {
        this.pass('robots.txt: Allow/Disallow rules present');
      } else {
        this.warn('robots.txt: No Allow/Disallow rules');
      }
    } catch (error) {
      this.fail('robots.txt: File not found');
    }
  }

  testSitemapFile() {
    this.section('Testing sitemap.xml');

    try {
      const sitemap = fs.readFileSync('sitemap.xml', 'utf-8');

      if (sitemap.includes('<?xml')) {
        this.pass('sitemap.xml: Valid XML declaration');
      } else {
        this.fail('sitemap.xml: Missing XML declaration');
      }

      if (sitemap.includes('<url>')) {
        const urlCount = (sitemap.match(/<url>/g) || []).length;
        this.pass(`sitemap.xml: ${urlCount} URL(s) found`);
      } else {
        this.fail('sitemap.xml: No URLs found');
      }

      if (sitemap.includes('xmlns=')) {
        this.pass('sitemap.xml: Proper XML namespace');
      } else {
        this.warn('sitemap.xml: Missing namespace declaration');
      }
    } catch (error) {
      this.fail('sitemap.xml: File not found');
    }
  }

  runFullAudit() {
    this.header('🚀 North Star AI - SEO Audit Agent');

    this.testRobotsFile();
    this.testSitemapFile();

    // Test each HTML page
    this.pages.forEach(page => {
      if (!fs.existsSync(page)) {
        this.warn(`${page}: File not found`);
        return;
      }

      this.section(`Testing ${page}`);

      const html = this.parseHTML(page);
      if (!html) return;

      // Run all tests
      this.testTitleTag(html.$, page);
      this.testMetaDescription(html.$, page);
      this.testMetaTags(html.$, page);
      this.testOpenGraph(html.$, page);
      this.testCanonical(html.$, page);
      this.testHeadingStructure(html.$, page);
      this.testImages(html.$, page);
      this.testStructuredData(html.$, page);
      this.testInternalLinks(html.$, page);
      this.testPageSize(html.$, page);

      // HTML validation
      const htmlIssues = this.testHTMLValidation(html.$);
      if (htmlIssues.length > 0) {
        htmlIssues.forEach(issue => this.warn(`${page}: ${issue}`));
      } else {
        this.pass(`${page}: HTML structure valid`);
      }

      this.results.pages[page] = 'checked';
      this.results.total += 1;
    });

    this.printSummary();
  }

  printSummary() {
    this.header('📊 SEO Audit Summary');

    const total = this.results.passed + this.results.failed + this.results.warnings;

    this.log(`Total Checks: ${total}`, 'cyan');
    this.log(`✓ Passed: ${this.results.passed}`, 'green');
    this.log(`✗ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'green');
    this.log(`⚠ Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'yellow' : 'green');

    const score = Math.round((this.results.passed / total) * 100);
    this.log(`\nSEO Score: ${score}%\n`, score > 80 ? 'green' : score > 60 ? 'yellow' : 'red');

    // Recommendations
    if (this.results.failed > 0) {
      this.section('Critical Issues to Fix');
      this.info('Review the failed items above and fix them first');
    }

    if (this.results.warnings > 0) {
      this.section('Warnings to Address');
      this.info('Review the warnings above for SEO improvements');
    }

    if (this.results.failed === 0 && this.results.warnings === 0) {
      this.log('\n🎉 Excellent! Your site has solid SEO fundamentals!', 'green');
    }

    this.log('\n📚 Next Steps:', 'cyan');
    this.log('1. Submit sitemap.xml to Google Search Console', 'blue');
    this.log('2. Monitor keyword rankings monthly', 'blue');
    this.log('3. Create a content calendar and publish blog posts', 'blue');
    this.log('4. Build quality backlinks from relevant sites', 'blue');
    this.log('5. Track organic traffic in Google Analytics', 'blue');
    this.log('\nFor detailed guidance, see SEO.md and SEO-AUDIT-CHECKLIST.md\n', 'blue');
  }
}

// Run the agent
if (require.main === module) {
  const agent = new SEOAgent();
  agent.runFullAudit();
}

module.exports = SEOAgent;
