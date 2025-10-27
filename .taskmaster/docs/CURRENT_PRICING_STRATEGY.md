# RentEst Current Pricing Strategy

## Current Pricing Model

### Free Tier
- **Lookups per month:** 5 (recently optimized from 20)
- **Features:**
  - Basic rent estimates
  - 5 comparable properties
  - Market insights
  - Basic property information
- **Cost:** $0
- **Monthly reset:** 1st of each month

### Pro Tier (Premium)
- **Price:** $9.99/month
- **Lookups per month:** Unlimited
- **Features:**
  - Unlimited rent estimates
  - 20 comparable properties (vs 5 for free)
  - Historical trend data
  - PDF report generation
  - Custom branding on reports
  - Priority support
- **Payment method:** ExtPay (Stripe backend)

---

## Why $9.99/Month?

### 1. Market Positioning
- **Competitive:** Aligns with other real estate tools
- **Affordable:** Low barrier to entry for landlords/investors
- **Psychological pricing:** $9.99 feels cheaper than $10

### 2. Revenue Model
- **Freemium strategy:** Free tier drives adoption, premium drives revenue
- **Low churn:** Monthly subscription is easy to cancel if not satisfied
- **Recurring revenue:** Predictable monthly income

### 3. Cost Justification

**RentCast API Costs (per user/month):**
- Free tier (5 lookups): 20 API calls = $4/user
- Premium tier (unlimited): ~100 API calls = $20/user (estimated)

**Pricing Math:**
- Premium at $9.99/month
- Minus API costs: ~$20/month (at scale)
- **Current model:** Needs optimization at scale

### 4. User Value Proposition
- **Time savings:** Get instant rent estimates (vs manual research)
- **Data accuracy:** 140M+ property records, real-time updates
- **Decision making:** Comparable properties help pricing decisions
- **Professional reports:** PDF generation for client presentations

---

## Free Tier Optimization (Recent Change)

### Why Reduced from 20 to 5?

**Cost Analysis:**
- **20 lookups/month:** $16/user/month in API costs
- **5 lookups/month:** $4/user/month in API costs
- **Savings:** 75% reduction

**Conversion Benefits:**
- Users hit limit faster → upgrade prompts sooner
- Still provides value (1 lookup/week)
- Aligns with industry standards (Zillow: 5, Estated: 5)

**Upgrade Triggers:**
- 50% usage (2-3 lookups): "Halfway Through Your Monthly Limit"
- 80% usage (4 lookups): "Running Low on Lookups"
- 100% usage (5 lookups): "Monthly Limit Reached" (cannot dismiss)

---

## Revenue Projections

### Conservative Scenario (5% conversion)
- 1,000 free users
- 50 paying users
- Revenue: 50 × $9.99 = **$499.50/month**
- API costs: (950 × $4) + (50 × $20) = **$4,800/month**
- **Status:** Loss leader (building user base)

### Moderate Scenario (10% conversion)
- 1,000 free users
- 100 paying users
- Revenue: 100 × $9.99 = **$999/month**
- API costs: (900 × $4) + (100 × $20) = **$5,600/month**
- **Status:** Needs scale to break even

### Optimistic Scenario (20% conversion)
- 1,000 free users
- 200 paying users
- Revenue: 200 × $9.99 = **$1,998/month**
- API costs: (800 × $4) + (200 × $20) = **$7,200/month**
- **Status:** Still loss leader, but growing

### Scale Scenario (10,000 users, 15% conversion)
- 10,000 free users
- 1,500 paying users
- Revenue: 1,500 × $9.99 = **$14,985/month**
- API costs: (8,500 × $4) + (1,500 × $20) = **$64,000/month**
- **Status:** Need higher pricing or lower API usage

---

## Pricing Strategy Considerations

### Current Challenges
1. **API costs too high** - RentCast at $0.20/request is expensive at scale
2. **Margin too thin** - $9.99 doesn't cover API costs for unlimited users
3. **Free tier loss** - Even 5 lookups costs $4/user/month

### Potential Solutions

**Option 1: Increase Premium Price**
- Raise to $14.99-$19.99/month
- Better margin, but may reduce conversion
- Target: Active investors/professionals

**Option 2: Tiered Premium**
- Basic: $4.99/month (50 lookups)
- Pro: $9.99/month (200 lookups)
- Enterprise: $19.99/month (unlimited)

**Option 3: Reduce API Calls**
- Implement smarter caching
- Batch API requests
- Reduce comparable properties from 5 to 3

**Option 4: Negotiate RentCast**
- Higher volume = better rates
- Foundation plan: $74/month for 1,000 calls
- At 1,000 users: $0.074/call (vs $0.20)

---

## Implementation Status

### ✅ Completed
- ExtPay integration (Stripe backend)
- Free tier quota enforcement (5 lookups/month)
- Premium tier unlimited access
- Monthly quota reset
- Upgrade prompts at 50%, 80%, 100%
- Test mode for development

### ⏭️ To Do
- Set up Stripe account for production
- Configure ExtPay dashboard
- Test payment flow end-to-end
- Monitor conversion rates
- Optimize API costs at scale
- Consider pricing adjustments

---

## Why This Pricing Makes Sense

### For Users
✅ Free tier is generous enough to try the tool  
✅ $9.99 is affordable for professionals  
✅ Unlimited access justifies the cost  
✅ Premium features add real value  

### For Business
✅ Freemium model drives adoption  
✅ Recurring revenue is predictable  
✅ Low churn (easy to cancel if needed)  
✅ Scalable to multiple tiers  

### For Monetization
✅ Aligns with market standards  
✅ Psychological pricing ($9.99 vs $10)  
✅ Room to increase if needed  
✅ Supports multiple pricing tiers  

---

## Next Steps

1. **Monitor conversion rate** - Track % of free users upgrading
2. **Analyze API costs** - Optimize queries and caching
3. **Gather user feedback** - Is $9.99 the right price?
4. **Test pricing variations** - A/B test different price points
5. **Scale infrastructure** - Prepare for growth

---

**Current Status:** ✅ Implemented  
**Last Updated:** October 27, 2025  
**Pricing Model:** Freemium ($0 free / $9.99 premium)  
**Free Tier:** 5 lookups/month  
**Premium Tier:** Unlimited lookups
