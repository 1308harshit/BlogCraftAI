// Analytics and conversion tracking system
const fs = require('fs');

class AnalyticsTracker {
  constructor() {
    this.metricsFile = 'campaign-metrics.json';
    this.loadMetrics();
  }

  loadMetrics() {
    try {
      const data = fs.readFileSync(this.metricsFile, 'utf8');
      this.metrics = JSON.parse(data);
    } catch (error) {
      // Initialize metrics if file doesn't exist
      this.metrics = {
        campaigns: {},
        overall: {
          totalLeads: 0,
          emailsSent: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          emailsReplied: 0,
          emailsBounced: 0,
          signups: 0,
          conversions: 0,
          revenue: 0,
          startDate: new Date().toISOString()
        },
        daily: {},
        sources: {}
      };
    }
  }

  saveMetrics() {
    fs.writeFileSync(this.metricsFile, JSON.stringify(this.metrics, null, 2));
  }

  // Track email events
  trackEmailSent(leadId, email, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    // Update overall metrics
    this.metrics.overall.emailsSent++;
    
    // Update daily metrics
    if (!this.metrics.daily[today]) {
      this.metrics.daily[today] = {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        emailsReplied: 0,
        signups: 0,
        conversions: 0
      };
    }
    this.metrics.daily[today].emailsSent++;
    
    // Update source metrics
    if (!this.metrics.sources[source]) {
      this.metrics.sources[source] = {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        emailsReplied: 0,
        signups: 0,
        conversions: 0,
        conversionRate: 0
      };
    }
    this.metrics.sources[source].emailsSent++;
    
    // Update campaign metrics
    if (!this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign] = {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        emailsReplied: 0,
        signups: 0,
        conversions: 0,
        startDate: new Date().toISOString()
      };
    }
    this.metrics.campaigns[campaign].emailsSent++;
    
    this.saveMetrics();
    console.log(`📧 Tracked email sent: ${email} (${source})`);
  }

  trackEmailOpened(leadId, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    this.metrics.overall.emailsOpened++;
    if (this.metrics.daily[today]) {
      this.metrics.daily[today].emailsOpened++;
    }
    if (this.metrics.sources[source]) {
      this.metrics.sources[source].emailsOpened++;
    }
    if (this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign].emailsOpened++;
    }
    
    this.saveMetrics();
    console.log(`👀 Email opened: ${leadId}`);
  }

  trackEmailClicked(leadId, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    this.metrics.overall.emailsClicked++;
    if (this.metrics.daily[today]) {
      this.metrics.daily[today].emailsClicked++;
    }
    if (this.metrics.sources[source]) {
      this.metrics.sources[source].emailsClicked++;
    }
    if (this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign].emailsClicked++;
    }
    
    this.saveMetrics();
    console.log(`🖱️ Email clicked: ${leadId}`);
  }

  trackEmailReply(leadId, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    this.metrics.overall.emailsReplied++;
    if (this.metrics.daily[today]) {
      this.metrics.daily[today].emailsReplied++;
    }
    if (this.metrics.sources[source]) {
      this.metrics.sources[source].emailsReplied++;
    }
    if (this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign].emailsReplied++;
    }
    
    this.saveMetrics();
    console.log(`💬 Email reply: ${leadId}`);
  }

  trackSignup(email, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    this.metrics.overall.signups++;
    if (this.metrics.daily[today]) {
      this.metrics.daily[today].signups++;
    }
    if (this.metrics.sources[source]) {
      this.metrics.sources[source].signups++;
    }
    if (this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign].signups++;
    }
    
    this.saveMetrics();
    console.log(`✅ Signup tracked: ${email} (${source})`);
  }

  trackConversion(email, amount, source, campaign = 'default') {
    const today = new Date().toISOString().split('T')[0];
    
    this.metrics.overall.conversions++;
    this.metrics.overall.revenue += amount;
    
    if (this.metrics.daily[today]) {
      this.metrics.daily[today].conversions++;
    }
    if (this.metrics.sources[source]) {
      this.metrics.sources[source].conversions++;
      this.metrics.sources[source].conversionRate = 
        (this.metrics.sources[source].conversions / this.metrics.sources[source].emailsSent * 100).toFixed(2);
    }
    if (this.metrics.campaigns[campaign]) {
      this.metrics.campaigns[campaign].conversions++;
    }
    
    this.saveMetrics();
    console.log(`💰 Conversion tracked: ${email} - ₹${amount} (${source})`);
  }

  // Generate comprehensive reports
  generateDashboard() {
    const overall = this.metrics.overall;
    const openRate = overall.emailsSent > 0 ? (overall.emailsOpened / overall.emailsSent * 100).toFixed(2) : 0;
    const clickRate = overall.emailsSent > 0 ? (overall.emailsClicked / overall.emailsSent * 100).toFixed(2) : 0;
    const replyRate = overall.emailsSent > 0 ? (overall.emailsReplied / overall.emailsSent * 100).toFixed(2) : 0;
    const conversionRate = overall.emailsSent > 0 ? (overall.conversions / overall.emailsSent * 100).toFixed(2) : 0;
    const avgRevenuePerEmail = overall.emailsSent > 0 ? (overall.revenue / overall.emailsSent).toFixed(2) : 0;

    console.log('\n📊 CAMPAIGN DASHBOARD');
    console.log('='.repeat(50));
    console.log(`📧 Total Emails Sent: ${overall.emailsSent.toLocaleString()}`);
    console.log(`👀 Open Rate: ${openRate}%`);
    console.log(`🖱️ Click Rate: ${clickRate}%`);
    console.log(`💬 Reply Rate: ${replyRate}%`);
    console.log(`✅ Signups: ${overall.signups.toLocaleString()}`);
    console.log(`💰 Conversions: ${overall.conversions.toLocaleString()}`);
    console.log(`📈 Conversion Rate: ${conversionRate}%`);
    console.log(`💵 Total Revenue: ₹${overall.revenue.toLocaleString()}`);
    console.log(`💸 Avg Revenue/Email: ₹${avgRevenuePerEmail}`);
    
    // ROI Calculation
    const estimatedCost = overall.emailsSent * 0.1; // ₹0.1 per email (rough estimate)
    const roi = estimatedCost > 0 ? ((overall.revenue - estimatedCost) / estimatedCost * 100).toFixed(2) : 0;
    console.log(`📊 ROI: ${roi}%`);
    
    console.log('\n📈 TOP PERFORMING SOURCES:');
    console.log('-'.repeat(30));
    
    const sortedSources = Object.entries(this.metrics.sources)
      .sort(([,a], [,b]) => b.conversions - a.conversions)
      .slice(0, 5);
    
    sortedSources.forEach(([source, data]) => {
      const sourceConversionRate = data.emailsSent > 0 ? (data.conversions / data.emailsSent * 100).toFixed(2) : 0;
      console.log(`${source}: ${data.conversions} conversions (${sourceConversionRate}% rate)`);
    });
  }

  generateWeeklyReport() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let weeklyStats = {
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      emailsReplied: 0,
      signups: 0,
      conversions: 0
    };
    
    // Sum up last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (this.metrics.daily[dateStr]) {
        const dayData = this.metrics.daily[dateStr];
        weeklyStats.emailsSent += dayData.emailsSent || 0;
        weeklyStats.emailsOpened += dayData.emailsOpened || 0;
        weeklyStats.emailsClicked += dayData.emailsClicked || 0;
        weeklyStats.emailsReplied += dayData.emailsReplied || 0;
        weeklyStats.signups += dayData.signups || 0;
        weeklyStats.conversions += dayData.conversions || 0;
      }
    }
    
    console.log('\n📅 WEEKLY REPORT (Last 7 Days)');
    console.log('='.repeat(40));
    console.log(`📧 Emails Sent: ${weeklyStats.emailsSent}`);
    console.log(`👀 Emails Opened: ${weeklyStats.emailsOpened}`);
    console.log(`🖱️ Emails Clicked: ${weeklyStats.emailsClicked}`);
    console.log(`💬 Emails Replied: ${weeklyStats.emailsReplied}`);
    console.log(`✅ Signups: ${weeklyStats.signups}`);
    console.log(`💰 Conversions: ${weeklyStats.conversions}`);
    
    const weeklyOpenRate = weeklyStats.emailsSent > 0 ? (weeklyStats.emailsOpened / weeklyStats.emailsSent * 100).toFixed(2) : 0;
    const weeklyConversionRate = weeklyStats.emailsSent > 0 ? (weeklyStats.conversions / weeklyStats.emailsSent * 100).toFixed(2) : 0;
    
    console.log(`📊 Weekly Open Rate: ${weeklyOpenRate}%`);
    console.log(`📈 Weekly Conversion Rate: ${weeklyConversionRate}%`);
  }

  // Export data for external analysis
  exportToCSV() {
    // Export daily metrics
    const dailyCSV = 'Date,Emails Sent,Emails Opened,Emails Clicked,Emails Replied,Signups,Conversions\n' +
      Object.entries(this.metrics.daily)
        .map(([date, data]) => 
          `${date},${data.emailsSent || 0},${data.emailsOpened || 0},${data.emailsClicked || 0},${data.emailsReplied || 0},${data.signups || 0},${data.conversions || 0}`
        ).join('\n');
    
    fs.writeFileSync('daily-metrics.csv', dailyCSV);
    
    // Export source metrics
    const sourceCSV = 'Source,Emails Sent,Emails Opened,Emails Clicked,Emails Replied,Signups,Conversions,Conversion Rate\n' +
      Object.entries(this.metrics.sources)
        .map(([source, data]) => 
          `${source},${data.emailsSent || 0},${data.emailsOpened || 0},${data.emailsClicked || 0},${data.emailsReplied || 0},${data.signups || 0},${data.conversions || 0},${data.conversionRate || 0}%`
        ).join('\n');
    
    fs.writeFileSync('source-metrics.csv', sourceCSV);
    
    console.log('📊 Metrics exported to daily-metrics.csv and source-metrics.csv');
  }

  // Predict future performance
  predictPerformance(days = 30) {
    const avgDailyEmails = this.metrics.overall.emailsSent / Math.max(1, Object.keys(this.metrics.daily).length);
    const currentConversionRate = this.metrics.overall.emailsSent > 0 ? 
      this.metrics.overall.conversions / this.metrics.overall.emailsSent : 0.02; // Default 2%
    
    const projectedEmails = avgDailyEmails * days;
    const projectedConversions = Math.round(projectedEmails * currentConversionRate);
    const projectedRevenue = projectedConversions * 999; // ₹999 per conversion
    
    console.log(`\n🔮 ${days}-DAY PROJECTION`);
    console.log('='.repeat(30));
    console.log(`📧 Projected Emails: ${Math.round(projectedEmails).toLocaleString()}`);
    console.log(`💰 Projected Conversions: ${projectedConversions.toLocaleString()}`);
    console.log(`💵 Projected Revenue: ₹${projectedRevenue.toLocaleString()}`);
    console.log(`📊 Based on ${currentConversionRate.toFixed(3)}% conversion rate`);
  }
}

// Usage
const tracker = new AnalyticsTracker();

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'dashboard':
    tracker.generateDashboard();
    break;
  case 'weekly':
    tracker.generateWeeklyReport();
    break;
  case 'export':
    tracker.exportToCSV();
    break;
  case 'predict':
    const days = parseInt(args[1]) || 30;
    tracker.predictPerformance(days);
    break;
  case 'track-email':
    // Example: node analytics-tracker.js track-email lead123 email@example.com upwork
    tracker.trackEmailSent(args[1], args[2], args[3]);
    break;
  case 'track-conversion':
    // Example: node analytics-tracker.js track-conversion email@example.com 999 upwork
    tracker.trackConversion(args[1], parseInt(args[2]), args[3]);
    break;
  default:
    console.log('Usage: node analytics-tracker.js [dashboard|weekly|export|predict|track-email|track-conversion]');
    tracker.generateDashboard();
}

module.exports = AnalyticsTracker;