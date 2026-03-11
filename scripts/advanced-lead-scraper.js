// Advanced lead scraping with multiple sources
const puppeteer = require('puppeteer');
const fs = require('fs');

class AdvancedLeadScraper {
  constructor() {
    this.leads = [];
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Scrape Upwork for SEO content jobs
  async scrapeUpworkJobs() {
    const page = await this.browser.newPage();
    
    try {
      console.log('Scraping Upwork jobs...');
      
      const searchQueries = [
        'SEO blog writing',
        'content writing SEO',
        'blog post writing',
        'article writing SEO',
        'content marketing writer'
      ];

      for (const query of searchQueries) {
        await page.goto(`https://www.upwork.com/search/jobs/?q=${encodeURIComponent(query)}`);
        await page.waitForSelector('.job-tile', { timeout: 10000 });
        
        const jobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll('.job-tile');
          return Array.from(jobElements).slice(0, 20).map(job => {
            const titleElement = job.querySelector('.job-tile-title a');
            const budgetElement = job.querySelector('.budget');
            const descElement = job.querySelector('.job-description');
            const clientElement = job.querySelector('.client-location');
            
            return {
              source: 'upwork',
              title: titleElement?.textContent?.trim() || '',
              budget: budgetElement?.textContent?.trim() || '',
              description: descElement?.textContent?.trim().substring(0, 200) || '',
              clientLocation: clientElement?.textContent?.trim() || '',
              searchQuery: query,
              scrapedAt: new Date().toISOString()
            };
          }).filter(job => job.title);
        });
        
        this.leads.push(...jobs);
        console.log(`Found ${jobs.length} jobs for "${query}"`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error scraping Upwork:', error);
    } finally {
      await page.close();
    }
  }

  // Scrape Fiverr for content writing gigs
  async scrapeFiverrGigs() {
    const page = await this.browser.newPage();
    
    try {
      console.log('Scraping Fiverr gigs...');
      
      await page.goto('https://www.fiverr.com/search/gigs?query=seo%20blog%20writing');
      await page.waitForSelector('.gig-card', { timeout: 10000 });
      
      const gigs = await page.evaluate(() => {
        const gigElements = document.querySelectorAll('.gig-card');
        return Array.from(gigElements).slice(0, 30).map(gig => {
          const titleElement = gig.querySelector('.gig-title');
          const priceElement = gig.querySelector('.price');
          const sellerElement = gig.querySelector('.seller-name');
          const ratingElement = gig.querySelector('.gig-rating');
          
          return {
            source: 'fiverr',
            title: titleElement?.textContent?.trim() || '',
            price: priceElement?.textContent?.trim() || '',
            seller: sellerElement?.textContent?.trim() || '',
            rating: ratingElement?.textContent?.trim() || '',
            scrapedAt: new Date().toISOString()
          };
        }).filter(gig => gig.title);
      });
      
      this.leads.push(...gigs);
      console.log(`Found ${gigs.length} Fiverr gigs`);
      
    } catch (error) {
      console.error('Error scraping Fiverr:', error);
    } finally {
      await page.close();
    }
  }

  // Find websites with blogs using Google search
  async findBlogWebsites() {
    const page = await this.browser.newPage();
    
    try {
      console.log('Finding websites with blogs...');
      
      const searchQueries = [
        'site:*.com "blog" "content marketing"',
        'site:*.com "SEO blog" "articles"',
        'inurl:blog site:*.com startup',
        'inurl:blog site:*.com ecommerce',
        'inurl:blog site:*.com saas'
      ];

      for (const query of searchQueries) {
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
        await page.waitForSelector('h3', { timeout: 10000 });
        
        const results = await page.evaluate(() => {
          const resultElements = document.querySelectorAll('div[data-ved] h3');
          return Array.from(resultElements).slice(0, 10).map(result => {
            const linkElement = result.closest('a');
            const url = linkElement?.href || '';
            const domain = url ? new URL(url).hostname : '';
            
            return {
              source: 'google-search',
              title: result.textContent?.trim() || '',
              url: url,
              domain: domain,
              scrapedAt: new Date().toISOString()
            };
          }).filter(result => result.url && result.domain);
        });
        
        this.leads.push(...results);
        console.log(`Found ${results.length} blog websites for "${query}"`);
        
        // Rate limiting for Google
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error finding blog websites:', error);
    } finally {
      await page.close();
    }
  }

  // Extract contact information from websites
  async extractContactInfo(websites) {
    console.log('Extracting contact information...');
    
    for (const website of websites.slice(0, 50)) { // Limit to 50 websites
      const page = await this.browser.newPage();
      
      try {
        await page.goto(website.url, { timeout: 15000 });
        
        const contactInfo = await page.evaluate(() => {
          // Look for email addresses
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const pageText = document.body.textContent || '';
          const emails = pageText.match(emailRegex) || [];
          
          // Look for contact links
          const contactLinks = Array.from(document.querySelectorAll('a'))
            .filter(link => /contact|about|team/i.test(link.textContent))
            .map(link => link.href);
          
          return {
            emails: [...new Set(emails)].slice(0, 3), // Unique emails, max 3
            contactLinks: [...new Set(contactLinks)].slice(0, 2)
          };
        });
        
        if (contactInfo.emails.length > 0) {
          this.leads.push({
            source: 'website-contact',
            domain: website.domain,
            url: website.url,
            emails: contactInfo.emails,
            contactLinks: contactInfo.contactLinks,
            scrapedAt: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.error(`Error extracting contact info from ${website.url}:`, error.message);
      } finally {
        await page.close();
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Generate lead scoring
  scoreLeads() {
    this.leads = this.leads.map(lead => {
      let score = 0;
      
      // Score based on source
      if (lead.source === 'upwork') score += 10;
      if (lead.source === 'fiverr') score += 8;
      if (lead.source === 'website-contact') score += 15;
      
      // Score based on keywords
      const text = (lead.title + ' ' + lead.description).toLowerCase();
      if (text.includes('seo')) score += 5;
      if (text.includes('blog')) score += 5;
      if (text.includes('content')) score += 3;
      if (text.includes('marketing')) score += 3;
      
      // Score based on budget (Upwork)
      if (lead.budget) {
        const budgetMatch = lead.budget.match(/\$(\d+)/);
        if (budgetMatch) {
          const amount = parseInt(budgetMatch[1]);
          if (amount >= 50) score += 10;
          else if (amount >= 25) score += 5;
        }
      }
      
      return { ...lead, score };
    });
    
    // Sort by score
    this.leads.sort((a, b) => b.score - a.score);
  }

  // Export leads to different formats
  async exportLeads() {
    // CSV export
    const csvHeaders = 'Source,Title,Domain,Email,Budget,Score,Description,Scraped At\n';
    const csvContent = this.leads.map(lead => {
      const email = lead.emails ? lead.emails[0] : '';
      const description = (lead.description || '').replace(/,/g, ';').substring(0, 100);
      return `${lead.source},${lead.title || ''},${lead.domain || ''},${email},${lead.budget || ''},${lead.score || 0},"${description}",${lead.scrapedAt}`;
    }).join('\n');
    
    fs.writeFileSync('leads.csv', csvHeaders + csvContent);
    
    // JSON export
    fs.writeFileSync('leads.json', JSON.stringify(this.leads, null, 2));
    
    // High-quality leads only
    const highQualityLeads = this.leads.filter(lead => lead.score >= 15);
    fs.writeFileSync('high-quality-leads.json', JSON.stringify(highQualityLeads, null, 2));
    
    console.log(`\n=== Export Complete ===`);
    console.log(`Total leads: ${this.leads.length}`);
    console.log(`High-quality leads: ${highQualityLeads.length}`);
    console.log(`Files created: leads.csv, leads.json, high-quality-leads.json`);
  }

  async run() {
    console.log('Starting advanced lead generation...');
    
    await this.init();
    
    try {
      await this.scrapeUpworkJobs();
      await this.scrapeFiverrGigs();
      await this.findBlogWebsites();
      
      // Extract contact info from blog websites
      const blogWebsites = this.leads.filter(lead => lead.source === 'google-search');
      await this.extractContactInfo(blogWebsites);
      
      this.scoreLeads();
      await this.exportLeads();
      
    } catch (error) {
      console.error('Error in lead generation:', error);
    } finally {
      await this.close();
    }
    
    console.log('Lead generation complete!');
  }
}

// Usage
const scraper = new AdvancedLeadScraper();
scraper.run().catch(console.error);

module.exports = AdvancedLeadScraper;