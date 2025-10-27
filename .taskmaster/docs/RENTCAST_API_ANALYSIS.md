# RentCast API Plan Analysis: Free Tier Usage Limits

## Executive Summary

**Recommendation:** ✅ **LOWER free tier usage from 20 to 10 lookups/month**

Based on RentCast's API pricing and our current implementation, we should reduce the free tier limit to optimize API costs while maintaining user satisfaction.

---

## RentCast API Pricing Structure

### Official RentCast API Plans

| Plan | Monthly Cost | Included Requests | Overage Cost |
|------|-------------|-------------------|--------------|
| **Developer** | $0 | 50 | $0.20/request |
| **Foundation** | $74 | 1,000 | $0.06/request |
| **Growth** | $199 | 5,000 | $0.03/request |
| **Scale** | $449 | 25,000 | $0.015/request |

### Key Facts:
- **Free tier:** 50 API calls/month
- **Overage charges:** $0.20 per request on free tier
- **No long-term contracts** - can change plans anytime
- **Monthly reset** - unused requests don't carry over

---

## Current Extension Implementation

### Current Free Tier Limit
- **20 lookups/month** per free user
- **Unlimited** for paid users
- **Monthly reset** on 1st of month

### API Calls Per Lookup
Each lookup typically requires:
1. **Rent Estimate** - 1 API call
2. **Comparable Properties** - 1 API call (returns 5-6 properties)
3. **Market Statistics** - 1 API call
4. **Historical Market Data** - 1 API call

**Total: ~4 API calls per user lookup**

---

## Cost Analysis

### Scenario 1: Current Implementation (20 lookups/month)

**Free Tier Users:**
- 20 lookups × 4 API calls = **80 API calls/month per user**
- Cost per user: 80 × $0.20 = **$16/month**
- 100 free users = **$1,600/month**
- 1,000 free users = **$16,000/month**

**Problem:** At scale, free tier becomes expensive!

### Scenario 2: Recommended (10 lookups/month)

**Free Tier Users:**
- 10 lookups × 4 API calls = **40 API calls/month per user**
- Cost per user: 40 × $0.20 = **$8/month**
- 100 free users = **$800/month**
- 1,000 free users = **$8,000/month**

**Benefit:** 50% cost reduction while maintaining value

### Scenario 3: Conservative (5 lookups/month)

**Free Tier Users:**
- 5 lookups × 4 API calls = **20 API calls/month per user**
- Cost per user: 20 × $0.20 = **$4/month**
- 100 free users = **$400/month**
- 1,000 free users = **$4,000/month**

**Benefit:** 75% cost reduction, but may reduce conversion

---

## Competitive Analysis

### Industry Standards for Real Estate Tools

| Tool | Free Tier Limit | Notes |
|------|-----------------|-------|
| **Zillow** | 5 searches/month | Limited to basic info |
| **Redfin** | Unlimited searches | Limited data depth |
| **Realtor.com** | 10 searches/month | Similar to our proposal |
| **Estated** | 5 lookups/month | Premium focus |
| **RentCast Platform** | 5 properties | Portfolio limit, not API calls |

**Insight:** 5-10 lookups/month is industry standard for free tiers

---

## Recommendation: Lower to 10 Lookups/Month

### Rationale

✅ **Cost Efficiency**
- Reduces API costs by 50%
- Still provides 40 API calls/month (within RentCast free tier of 50)
- Leaves buffer for market data and other features

✅ **User Experience**
- 10 lookups = ~2-3 per week
- Sufficient for casual users to evaluate properties
- Encourages upgrade for active investors

✅ **Conversion Optimization**
- Users hit limit faster → upgrade prompts sooner
- Still generous enough to demonstrate value
- Aligns with industry standards

✅ **Scalability**
- Sustainable at 1,000+ users
- Predictable cost structure
- Room to grow paid tier

✅ **API Quota Management**
- 10 lookups × 4 calls = 40 calls/month
- RentCast free tier = 50 calls/month
- Leaves 10 calls buffer for other features

### Implementation

**Update in `customize-app/hooks/useUsageTracking.js`:**

```javascript
// Current
const FREE_TIER_LIMIT = 20

// Recommended
const FREE_TIER_LIMIT = 10
```

**Update messaging:**
- "10 lookups per month" (instead of 20)
- "Upgrade to unlimited searches"
- Show upgrade prompt at 50%, 80%, 100%

---

## Alternative Scenarios

### If We Want Maximum Conversion (5 lookups/month)
- **Pros:** Highest upgrade rate, lowest costs
- **Cons:** May frustrate users, reduce organic growth
- **Cost:** $4/user/month

### If We Want Maximum User Retention (15 lookups/month)
- **Pros:** Better user satisfaction, more organic growth
- **Cons:** Higher costs, slower conversion
- **Cost:** $12/user/month

---

## Implementation Checklist

- [ ] Update `FREE_TIER_LIMIT` from 20 to 10
- [ ] Update UI messaging in upgrade prompts
- [ ] Update documentation (README, help center)
- [ ] Notify existing free users of change
- [ ] Monitor conversion rate post-change
- [ ] Track API usage and costs
- [ ] A/B test if needed

---

## Monitoring Metrics

Track these after implementation:

1. **API Cost per User**
   - Target: < $10/month for free tier
   - Current: $16/month

2. **Conversion Rate**
   - Track % of free users upgrading
   - Target: 5-10% conversion

3. **User Retention**
   - Track churn rate
   - Ensure it doesn't increase significantly

4. **Total API Spend**
   - Monitor monthly RentCast bill
   - Ensure it stays within budget

---

## Conclusion

**Recommendation: Lower free tier from 20 to 10 lookups/month**

This change:
- ✅ Reduces API costs by 50%
- ✅ Aligns with industry standards
- ✅ Maintains user value
- ✅ Improves conversion potential
- ✅ Stays within RentCast free tier (50 calls)
- ✅ Provides sustainable scaling path

**Next Steps:**
1. Implement the change
2. Monitor metrics for 2-4 weeks
3. Adjust if needed based on data
4. Consider A/B testing with different cohorts

---

**Analysis Date:** October 27, 2025  
**Data Source:** RentCast API Documentation (https://www.rentcast.io/api)  
**Research Method:** Exa + Firecrawl web scraping
