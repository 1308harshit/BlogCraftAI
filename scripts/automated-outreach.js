// Complete automated outreach system
const nodemailer = require('nodemailer');
const fs = require('fs');
const EmailTemplates = require('./email-templates');

class AutomatedOutreach {
  constructor() {
    this.transporter = this.setupTransporter();
    this.dailyLimit = 100; // Emails per day
    this.sentToday = 0;
    this.campaignStats = {
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0
    };
  }

  setupTransporter() {
    // Gmail setup (you can also use other providers)
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'hello@blogcraft-ai.com',
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async loadLeads() {
    try {
      // Load high-quality leads
      const leadsData = fs.readFileSync('high-quality-leads.json', 'utf8');
      const leads = JSON.parse(leadsData);
      
      // Filter leads that haven't been contacted
      return leads.filter(lead => !lead.contacted && lead.emails && lead.emails.length > 0);
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }

  async sendEmail(lead, template) {
    const { subject, body } = template;
    const email = lead.emails[0]; // Use first email

    const mailOptions = {
      from: `"Alex Chen - BlogCraft AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
      // Add tracking pixel for open tracking
      attachments: [{
        filename: 'tracking.png',
        path: `https://your-domain.com/track/open/${lead.id || Date.now()}`,
        cid: 'tracking'
      }]
    };

    try {
      await this.transporter.sendMail(mailOptions);
      
      // Update lead status
      lead.contacted = true;
      lead.lastContactDate = new Date().toISOString();
      lead.emailsSent = (lead.emailsSent || 0) + 1;
      
      this.campaignStats.sent++;
      this.sentToday++;
      
      console.log(`✅ Email sent to ${email} (${lead.source})`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error.message);
      
      if (error.message.includes('bounce') || error.message.includes('invalid')) {
        lead.bounced = true;
        this.campaignStats.bounced++;
      }
      
      return false;
    }
  }

  async runDailyCampaign() {
    console.log('🚀 Starting daily outreach campaign...');
    
    const leads = await this.loadLeads();
    console.log(`📊 Loaded ${leads.length} leads`);
    
    if (leads.length === 0) {
      console.log('No leads to contact today');
      return;
    }

    // Sort leads by score (highest first)
    leads.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    let emailsSentToday = 0;
    const maxEmailsPerDay = Math.min(this.dailyLimit, leads.length);
    
    for (let i = 0; i < maxEmailsPerDay && emailsSentToday < this.dailyLimit; i++) {
      const lead = leads[i];
      
      // Generate personalized template
      const template = EmailTemplates.getTemplateForLead(lead);
      const personalizedTemplate = EmailTemplates.personalizeTemplate(template, lead);
      
      // Send email
      const success = await this.sendEmail(lead, personalizedTemplate);
      
      if (success) {
        emailsSentToday++;
        
        // Rate limiting: wait 30 seconds between emails
        if (i < maxEmailsPerDay - 1) {
          console.log('⏳ Waiting 30 seconds...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      }
      
      // Stop if we hit daily limit
      if (emailsSentToday >= this.dailyLimit) {
        console.log(`📈 Daily limit reached: ${this.dailyLimit} emails`);
        break;
      }
    }
    
    // Save updated leads
    await this.saveLeads(leads);
    
    // Print campaign summary
    this.printCampaignSummary(emailsSentToday);
  }

  async runFollowUpCampaign() {
    console.log('📧 Starting follow-up campaign...');
    
    const leads = await this.loadLeads();
    
    // Find leads that were contacted 3+ days ago and haven't replied
    const followUpLeads = leads.filter(lead => {
      if (!lead.contacted || lead.replied) return false;
      
      const lastContact = new Date(lead.lastContactDate);
      const daysSinceContact = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24);
      
      return daysSinceContact >= 3 && daysSinceContact <= 10;
    });
    
    console.log(`📊 Found ${followUpLeads.length} leads for follow-up`);
    
    let followUpsSent = 0;
    const maxFollowUps = Math.min(50, followUpLeads.length); // Limit follow-ups
    
    for (let i = 0; i < maxFollowUps; i++) {
      const lead = followUpLeads[i];
      
      const template = EmailTemplates.getTemplate('follow_up', lead);
      const personalizedTemplate = EmailTemplates.personalizeTemplate(template, lead);
      
      const success = await this.sendEmail(lead, personalizedTemplate);
      
      if (success) {
        followUpsSent++;
        lead.followUpsSent = (lead.followUpsSent || 0) + 1;
        
        // Rate limiting
        if (i < maxFollowUps - 1) {
          await new Promise(resolve => setTimeout(resolve, 45000)); // 45 seconds for follow-ups
        }
      }
    }
    
    await this.saveLeads(leads);
    console.log(`📈 Follow-up campaign complete: ${followUpsSent} emails sent`);
  }

  async saveLeads(leads) {
    try {
      fs.writeFileSync('high-quality-leads.json', JSON.stringify(leads, null, 2));
      console.log('💾 Leads data saved');
    } catch (error) {
      console.error('Error saving leads:', error);
    }
  }

  printCampaignSummary(emailsSent) {
    console.log('\n📊 Campaign Summary:');
    console.log(`Emails sent today: ${emailsSent}`);
    console.log(`Total campaign emails: ${this.campaignStats.sent}`);
    console.log(`Bounce rate: ${((this.campaignStats.bounced / this.campaignStats.sent) * 100).toFixed(1)}%`);
    
    // Calculate estimated response rate (industry average: 1-3%)
    const estimatedReplies = Math.round(this.campaignStats.sent * 0.02);
    console.log(`Estimated replies: ${estimatedReplies} (2% response rate)`);
    
    // Calculate potential revenue
    const estimatedConversions = Math.round(estimatedReplies * 0.1); // 10% of replies convert
    const monthlyRevenue = estimatedConversions * 999; // ₹999 per customer
    console.log(`Potential monthly revenue: ₹${monthlyRevenue.toLocaleString()}`);
  }

  // Integration with Instantly.ai for advanced features
  async sendViaInstantly(leads) {
    const instantlyEndpoint = 'https://api.instantly.ai/api/v1/campaign/add_leads';
    
    const campaignData = {
      api_key: process.env.INSTANTLY_API_KEY,
      campaign_id: 'your_campaign_id',
      leads: leads.slice(0, 100).map(lead => ({
        email: lead.emails[0],
        first_name: lead.name || 'there',
        company_name: lead.company || lead.domain,
        website: lead.url || `https://${lead.domain}`,
        custom_variables: {
          lead_source: lead.source,
          lead_score: lead.score,
          industry: lead.industry || 'general'
        }
      }))
    };
    
    try {
      const response = await fetch(instantlyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });
      
      if (response.ok) {
        console.log('✅ Leads uploaded to Instantly.ai');
      } else {
        console.error('❌ Failed to upload to Instantly.ai');
      }
    } catch (error) {
      console.error('Error with Instantly.ai:', error);
    }
  }

  // Schedule campaigns
  async scheduleCampaigns() {
    console.log('⏰ Setting up campaign schedule...');
    
    // Run daily campaign every day at 9 AM
    const runDailyAt9AM = () => {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(9, 0, 0, 0);
      
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilRun = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        this.runDailyCampaign();
        setInterval(() => this.runDailyCampaign(), 24 * 60 * 60 * 1000); // Every 24 hours
      }, timeUntilRun);
      
      console.log(`📅 Daily campaign scheduled for ${scheduledTime.toLocaleString()}`);
    };
    
    // Run follow-up campaign every 3 days at 2 PM
    const runFollowUpEvery3Days = () => {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(14, 0, 0, 0);
      
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilRun = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        this.runFollowUpCampaign();
        setInterval(() => this.runFollowUpCampaign(), 3 * 24 * 60 * 60 * 1000); // Every 3 days
      }, timeUntilRun);
      
      console.log(`📅 Follow-up campaign scheduled for ${scheduledTime.toLocaleString()}`);
    };
    
    runDailyAt9AM();
    runFollowUpEvery3Days();
  }
}

// Usage
const outreach = new AutomatedOutreach();

// Command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'daily':
    outreach.runDailyCampaign().catch(console.error);
    break;
  case 'followup':
    outreach.runFollowUpCampaign().catch(console.error);
    break;
  case 'schedule':
    outreach.scheduleCampaigns();
    break;
  case 'instantly':
    outreach.loadLeads().then(leads => {
      outreach.sendViaInstantly(leads);
    });
    break;
  default:
    console.log('Usage: node automated-outreach.js [daily|followup|schedule|instantly]');
}

module.exports = AutomatedOutreach;