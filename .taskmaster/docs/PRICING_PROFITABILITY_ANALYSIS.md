# Premium Pricing Analysis: Break-Even & Profitability

## Current Situation

**API Costs (per user/month):**
- Free tier (5 lookups): 20 API calls = $4/user
- Premium tier (unlimited): ~100 API calls = $20/user

**Current Premium Price:** $9.99/month  
**Current Margin:** $9.99 - $20 = **-$10.01 (LOSS)**

---

## Profitability Analysis by Price Point

### Price Point: $14.99/month

**Margin per premium user:** $14.99 - $20 = **-$5.01 (LOSS)**

**Break-even analysis (1,000 total users):**

| Conversion Rate | Premium Users | Revenue | API Costs | Profit/Loss |
|-----------------|---------------|---------|-----------|------------|
| 5% | 50 | $749.50 | $5,800 | -$5,050.50 |
| 10% | 100 | $1,499 | $6,600 | -$5,101 |
| 15% | 150 | $2,248.50 | $7,400 | -$5,151.50 |
| 20% | 200 | $2,998 | $8,200 | -$5,202 |

**Verdict:** ❌ **Still unprofitable** - Premium users cost more than they generate

---

### Price Point: $19.99/month

**Margin per premium user:** $19.99 - $20 = **-$0.01 (BREAK-EVEN)**

**Break-even analysis (1,000 total users):**

| Conversion Rate | Premium Users | Revenue | API Costs | Profit/Loss |
|-----------------|---------------|---------|-----------|------------|
| 5% | 50 | $999.50 | $5,800 | -$4,800.50 |
| 10% | 100 | $1,999 | $6,600 | -$4,601 |
| 15% | 150 | $2,998.50 | $7,400 | -$4,401.50 |
| 20% | 200 | $3,998 | $8,200 | -$4,202 |

**Verdict:** ⚠️ **Break-even on premium only** - But free tier still costs money

---

## The Real Problem: Free Tier Losses

Even at $19.99, you're losing money on free users!

**With 1,000 users (15% conversion):**
- 850 free users × $4 = **$3,400/month loss**
- 150 premium users × $0 margin = $0
- **Total loss: $3,400/month**

---

## Solutions to Achieve Profitability

### Option A: Increase Premium Price to $29.99/month

**Margin per premium user:** $29.99 - $20 = **$9.99 PROFIT**

**With 1,000 users (15% conversion):**
- 850 free users × $4 = -$3,400
- 150 premium users × $9.99 = +$1,498.50
- **Net: -$1,901.50 (Still loss)**

**With 1,000 users (25% conversion):**
- 750 free users × $4 = -$3,000
- 250 premium users × $9.99 = +$2,497.50
- **Net: -$502.50 (Close to break-even)**

**With 1,000 users (30% conversion):**
- 700 free users × $4 = -$2,800
- 300 premium users × $9.99 = +$2,997
- **Net: +$197 (PROFITABLE!)**

**Verdict:** ✅ **$29.99 works IF you achieve 30%+ conversion**

---

### Option B: Reduce Free Tier to 3 Lookups

**Free tier cost:** 3 lookups × 4 calls = 12 API calls = $2.40/user

**With 1,000 users (15% conversion) at $19.99:**
- 850 free users × $2.40 = -$2,040
- 150 premium users × $0 margin = $0
- **Net: -$2,040 (Better!)**

**With 1,000 users (15% conversion) at $24.99:**
- 850 free users × $2.40 = -$2,040
- 150 premium users × $4.99 = +$748.50
- **Net: -$1,291.50 (Still loss)**

**With 1,000 users (20% conversion) at $24.99:**
- 800 free users × $2.40 = -$1,920
- 200 premium users × $4.99 = +$998
- **Net: -$922 (Closer)**

**Verdict:** ⚠️ **Reduces losses but doesn't achieve profitability**

---

### Option C: Negotiate Better RentCast Rates

**Current:** $0.20/request (free tier)  
**Foundation plan:** $74/month for 1,000 calls = $0.074/request

**With Foundation plan:**
- Free tier (5 lookups): 20 calls × $0.074 = **$1.48/user**
- Premium tier (100 lookups): 400 calls × $0.074 = **$7.40/user**

**With 1,000 users (15% conversion) at $19.99:**
- 850 free users × $1.48 = -$1,258
- 150 premium users × ($19.99 - $7.40) = +$1,888.50
- **Net: +$630.50 (PROFITABLE!)**

**Verdict:** ✅ **$19.99 works with better API rates**

---

### Option D: Implement Tiered Premium

**Tier 1 - Basic:** $4.99/month (50 lookups)
- API cost: 200 calls × $0.20 = $40/month
- **Loss per user: -$35.01**

**Tier 2 - Pro:** $14.99/month (200 lookups)
- API cost: 800 calls × $0.20 = $160/month
- **Loss per user: -$145.01**

**Tier 3 - Enterprise:** $29.99/month (unlimited)
- API cost: 400 calls × $0.20 = $80/month
- **Profit per user: +$19.99**

**Verdict:** ❌ **Tiered pricing doesn't help with current API costs**

---

## RECOMMENDATION: Hybrid Approach

### Best Path to Profitability

**Step 1: Immediate (Next 2 weeks)**
- Increase premium price to **$24.99/month**
- Reduce free tier to **3 lookups/month**
- Expected conversion impact: -5% (some users won't upgrade)

**Step 2: Short-term (Month 1-2)**
- Negotiate RentCast Foundation plan ($74/month)
- This gives you $0.074/request instead of $0.20
- Instantly improves margins by 63%

**Step 3: Medium-term (Month 3+)**
- Monitor conversion rates
- If conversion > 20%, keep $24.99
- If conversion < 15%, increase to $29.99

---

## Profitability Scenarios

### Scenario A: $24.99 + 3 Lookups + RentCast Foundation
**With 1,000 users, 15% conversion:**
- 850 free users × $1.11 = -$943.50
- 150 premium users × ($24.99 - $7.40) = +$2,638.50
- **Net: +$1,695 PROFIT ✅**

### Scenario B: $29.99 + 5 Lookups + Current API Rates
**With 1,000 users, 25% conversion:**
- 750 free users × $4 = -$3,000
- 250 premium users × $9.99 = +$2,497.50
- **Net: -$502.50 (Close)**

### Scenario C: $19.99 + 5 Lookups + RentCast Foundation
**With 1,000 users, 20% conversion:**
- 800 free users × $1.48 = -$1,184
- 200 premium users × ($19.99 - $7.40) = +$2,518
- **Net: +$1,334 PROFIT ✅**

---

## Final Recommendation

### **Choose: $24.99/month**

**Why:**
1. ✅ **Profitable at 15% conversion** (realistic for freemium)
2. ✅ **Requires negotiating RentCast** (Foundation plan)
3. ✅ **Reduces free tier to 3 lookups** (still valuable)
4. ✅ **Room to adjust** if conversion differs
5. ✅ **Psychological pricing** - $24.99 feels premium but not excessive

**Break-even at:**
- 15% conversion with RentCast Foundation plan
- 25% conversion with current API rates

**Expected profit at scale:**
- 10,000 users, 15% conversion, RentCast Foundation = **$16,950/month**

---

## Action Plan

### Week 1: Negotiate RentCast
- [ ] Contact RentCast sales
- [ ] Request Foundation plan ($74/month for 1,000 calls)
- [ ] Estimate: 63% cost reduction

### Week 2: Update Pricing
- [ ] Change premium price to $24.99
- [ ] Reduce free tier to 3 lookups
- [ ] Update UI messaging
- [ ] Deploy changes

### Week 3-4: Monitor
- [ ] Track conversion rate
- [ ] Monitor churn rate
- [ ] Calculate actual profitability
- [ ] Adjust if needed

### Month 2+: Optimize
- [ ] Analyze user feedback on pricing
- [ ] Test price sensitivity
- [ ] Consider tiered options if needed
- [ ] Scale infrastructure

---

## Summary Table

| Price | Free Tier | API Plan | 15% Conv | 20% Conv | 25% Conv |
|-------|-----------|----------|----------|----------|----------|
| $14.99 | 5 | Current | -$5,151 | -$5,202 | -$5,252 |
| $19.99 | 5 | Current | -$4,401 | -$4,202 | -$4,002 |
| $24.99 | 3 | Current | -$1,291 | -$922 | -$552 |
| $24.99 | 3 | Foundation | **+$1,695** | **+$2,064** | **+$2,434** |
| $29.99 | 5 | Current | -$1,901 | -$502 | +$897 |
| $29.99 | 5 | Foundation | **+$2,099** | **+$2,998** | **+$3,897** |

**Best option highlighted:** $24.99 with RentCast Foundation plan

---

**Analysis Date:** October 27, 2025  
**Recommendation:** $24.99/month premium pricing  
**Profitability Target:** 15%+ conversion rate  
**Key Requirement:** Negotiate RentCast Foundation plan
