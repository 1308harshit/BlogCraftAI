// Email templates for different scenarios
class EmailTemplates {
  static getTemplate(type, lead) {
    const templates = {
      // For Upwork job posters
      upwork_job_poster: {
        subject: `Faster alternative to hiring freelance writers`,
        body: `Hi there,

I noticed you posted a job for "${lead.title}" on Upwork.

Instead of waiting for proposals and managing freelancers, what if you could generate SEO-optimized blog posts in 60 seconds?

I built BlogCraft AI - it's helping 1000+ businesses create content faster and cheaper than hiring writers.

Quick comparison:
• Freelancer: ₹50-100 per article + 2-3 days wait
• BlogCraft AI: ₹3 per article + 60 seconds

Would you like to see a free demo with your topic?

Best regards,
Alex Chen

P.S. Here's a sample article I generated about your industry: [demo link]`
      },

      // For website owners with blogs
      blog_owner: {
        subject: `Quick question about ${lead.domain}'s content strategy`,
        body: `Hi,

I was reading your blog on ${lead.domain} - great content!

Quick question: How much time does your team spend writing blog articles each month?

I ask because I built BlogCraft AI - it generates Google-optimized blog posts in under a minute. It's already helping companies save ₹50,000+ monthly on content creation.

The results are impressive:
• SEO-optimized content
• Consistent publishing schedule  
• 95% cost reduction vs freelancers

Interested in a 2-minute demo?

Cheers,
Alex Chen`
      },

      // For Fiverr sellers (to become customers)
      fiverr_seller: {
        subject: `Scale your content writing business 10x`,
        body: `Hi ${lead.seller},

Saw your SEO writing gig on Fiverr - impressive reviews!

I built something that could help you scale your business dramatically. It's an AI that generates SEO-optimized blog posts in 60 seconds.

Here's how other writers are using it:
• Generate first drafts instantly
• Handle 10x more clients
• Focus on editing vs writing from scratch
• Increase profit margins

Want to see how it works? I can show you in 2 minutes.

Best,
[Your Name]`
      },

      // Follow-up email
      follow_up: {
        subject: `Re: ${lead.originalSubject}`,
        body: `Hi ${lead.name},

Following up on my email about AI content generation.

I know you're busy, so I'll keep this short:

• 60-second blog post generation
• SEO-optimized content
• ₹999/month vs ₹50+ per article
• 500+ businesses already using it

Here's a free sample article I generated for your industry: [demo link]

Worth a quick look?

Best,
[Your Name]`
      },

      // For startups/small businesses
      startup_focused: {
        subject: `How ${lead.company} can publish 10x more content`,
        body: `Hi ${lead.name},

Noticed ${lead.company} has been growing fast - congrats!

Quick question: Is content marketing on your roadmap for 2024?

Most startups struggle with consistent content creation because:
• Good writers are expensive (₹50-100 per article)
• Quality is inconsistent
• Takes forever to scale

I built an AI solution that's helping 500+ startups publish 10x more content:
• Generate SEO blog posts in 60 seconds
• Consistent quality every time
• ₹999/month for unlimited articles

Want to see a demo with your industry topic?

Best,
[Your Name]

P.S. Happy to generate a free sample article about [relevant topic] to show you the quality.`
      },

      // For agencies
      agency_focused: {
        subject: `White-label AI content solution for agencies`,
        body: `Hi ${lead.name},

Are you offering content marketing services to your clients?

I built an AI tool that's perfect for agencies:
• Generate client blog posts in 60 seconds
• White-label solution available
• 90%+ profit margins
• Scale to 100+ clients easily

Current agencies are using it to:
• Offer content packages at ₹10,000/month
• Deliver 10+ articles per client
• Actual cost: ₹999/month for unlimited generation

Interested in seeing how this could work for your agency?

Best,
[Your Name]`
      }
    };

    return templates[type] || templates.blog_owner;
  }

  static personalizeTemplate(template, lead) {
    let { subject, body } = template;

    // Replace placeholders
    const replacements = {
      '[Your Name]': 'Alex Chen - Founder, BlogCraft AI',
      '[demo link]': 'https://blogcraft-ai.vercel.app/generator',
      '${lead.title}': lead.title || 'content writing project',
      '${lead.domain}': lead.domain || 'your website',
      '${lead.seller}': lead.seller || 'there',
      '${lead.company}': lead.company || 'your company',
      '${lead.name}': lead.name || 'there',
      '${lead.originalSubject}': lead.originalSubject || 'AI content generation'
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      body = body.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return { subject, body };
  }

  static getTemplateForLead(lead) {
    // Determine best template based on lead source and characteristics
    if (lead.source === 'upwork') {
      return this.getTemplate('upwork_job_poster', lead);
    } else if (lead.source === 'fiverr') {
      return this.getTemplate('fiverr_seller', lead);
    } else if (lead.source === 'website-contact') {
      return this.getTemplate('blog_owner', lead);
    } else if (lead.company && lead.company.toLowerCase().includes('startup')) {
      return this.getTemplate('startup_focused', lead);
    } else if (lead.company && lead.company.toLowerCase().includes('agency')) {
      return this.getTemplate('agency_focused', lead);
    } else {
      return this.getTemplate('blog_owner', lead);
    }
  }

  static generateEmailSequence(lead) {
    // Generate a sequence of emails for nurturing
    const sequence = [];

    // Initial email
    const initialTemplate = this.getTemplateForLead(lead);
    sequence.push({
      day: 0,
      ...this.personalizeTemplate(initialTemplate, lead),
      type: 'initial'
    });

    // Follow-up after 3 days
    const followUpTemplate = this.getTemplate('follow_up', {
      ...lead,
      originalSubject: initialTemplate.subject
    });
    sequence.push({
      day: 3,
      ...this.personalizeTemplate(followUpTemplate, lead),
      type: 'follow_up'
    });

    // Value-add email after 7 days
    sequence.push({
      day: 7,
      subject: 'Free SEO content audit for your website',
      body: `Hi ${lead.name || 'there'},

I did a quick content audit of ${lead.domain || 'your website'} and found some opportunities to improve your SEO rankings.

Here are 3 quick wins:
1. [Specific suggestion based on their content]
2. [Another specific suggestion]
3. [Third suggestion]

Also generated a sample blog post that could rank well for your industry: [demo link]

No strings attached - just wanted to help!

Best,
[Your Name]`,
      type: 'value_add'
    });

    return sequence;
  }
}

module.exports = EmailTemplates;