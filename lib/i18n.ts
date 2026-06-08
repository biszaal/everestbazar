/* EverestBazar — bilingual strings (EN ⇄ नेपाली).
   Ported from the Claude Design handoff. Each key carries both languages. */

export type Lang = "en" | "ne";

export type Bilingual = { en: string; ne: string };

export const STRINGS = {
  // ---- nav ----
  "nav.browse": { en: "Browse", ne: "किनमेल" },
  "nav.how": { en: "How it works", ne: "कसरी काम गर्छ" },
  "nav.sell": { en: "Sell", ne: "बेच्नुहोस्" },
  "nav.safety": { en: "Safety", ne: "सुरक्षा" },
  "nav.cta": { en: "Browse listings", ne: "सामान हेर्नुहोस्" },
  "lang.label": { en: "EN", ne: "ने" },

  // ---- hero ----
  "hero.eyebrow": {
    en: "Nepal's first trusted secondhand marketplace",
    ne: "नेपालको पहिलो भरोसायोग्य पुरानो-सामान बजार",
  },
  "hero.h1a": { en: "Secondhand goods.", ne: "पुरानो सामान।" },
  "hero.h1b": { en: "Zero scams.", ne: "ठगी शून्य।" },
  "hero.sub": {
    en: "Every seller is verified against their national ID. Every payment is held safely in escrow until you confirm you received exactly what was promised.",
    ne: "हरेक बिक्रेता राष्ट्रिय परिचयपत्रबाट प्रमाणित हुन्छन्। हरेक भुक्तानी तपाईंले सामान पाएको पुष्टि नगरेसम्म एस्क्रोमा सुरक्षित राखिन्छ।",
  },
  "hero.cta1": { en: "Browse listings", ne: "सामान हेर्नुहोस्" },
  "hero.cta2": { en: "Become a seller", ne: "बिक्रेता बन्नुहोस्" },
  "hero.note": {
    en: "Everest — nature’s highest standard.  EverestBazar — commerce’s.",
    ne: "एभरेस्ट — प्रकृतिको सर्वोच्च मापदण्ड।  एभरेस्टबजार — व्यापारको।",
  },
  "hero.cardTitle": { en: "iPhone 13 · 128GB", ne: "आइफोन १३ · १२८जीबी" },
  "hero.cardLoc": { en: "Baneshwor, Kathmandu", ne: "बानेश्वर, काठमाडौं" },
  "hero.verified": { en: "Verified seller", ne: "प्रमाणित बिक्रेता" },
  "hero.escrow": { en: "Escrow protected", ne: "एस्क्रो सुरक्षित" },

  // ---- stat band ----
  "stat.pre": {
    en: "Online fraud complaints in Nepal have grown",
    ne: "नेपालमा अनलाइन ठगीका उजुरीहरू बढेका छन्",
  },
  "stat.unit": { en: "in five years", ne: "पाँच वर्षमा" },
  "stat.post": {
    en: "Sending money to a stranger on Facebook should not be a gamble.",
    ne: "फेसबुकमा अपरिचितलाई पैसा पठाउनु जुवा हुनुहुँदैन।",
  },
  "stat.reassure": {
    en: "We built EverestBazar so that number never includes you.",
    ne: "हामीले एभरेस्टबजार बनायौं ताकि त्यो संख्यामा तपाईं कहिल्यै नपर्नुहोस्।",
  },

  // ---- how it works ----
  "how.eyebrow": { en: "Why we’re different", ne: "हामी किन फरक छौं" },
  "how.title": {
    en: "Three things Nepal has never had in one marketplace.",
    ne: "नेपालले एउटै बजारमा कहिल्यै नपाएका तीन कुरा।",
  },
  "how.s1t": { en: "Verified sellers", ne: "प्रमाणित बिक्रेता" },
  "how.s1d": {
    en: "Before anyone can list, we check them against their national ID. Real people, real accountability — not anonymous accounts.",
    ne: "कसैले सामान राख्नुअघि हामी राष्ट्रिय परिचयपत्रबाट जाँच गर्छौं। वास्तविक मानिस, वास्तविक जवाफदेहिता — अज्ञात खाता होइन।",
  },
  "how.s2t": { en: "Escrow-protected payments", ne: "एस्क्रो-सुरक्षित भुक्तानी" },
  "how.s2d": {
    en: "Your money is held safely until you confirm you got exactly what was promised. No more blind transfers into the void.",
    ne: "तपाईंले सामान पाएको पुष्टि नगरेसम्म पैसा सुरक्षित राखिन्छ। अब अन्धाधुन्ध रकम पठाउनुपर्दैन।",
  },
  "how.s3t": { en: "Real dispute resolution", ne: "वास्तविक विवाद समाधान" },
  "how.s3d": {
    en: "If something goes wrong, there’s a real process and real people to make it right — not silence and a blocked number.",
    ne: "केही बिग्रियो भने सच्याउन वास्तविक प्रक्रिया र वास्तविक मानिस छन् — मौनता र ब्लक गरिएको नम्बर होइन।",
  },

  // ---- escrow demo ----
  "escrow.eyebrow": { en: "How escrow works", ne: "एस्क्रो कसरी काम गर्छ" },
  "escrow.title": {
    en: "Watch your money stay safe.",
    ne: "तपाईंको पैसा कसरी सुरक्षित रहन्छ हेर्नुहोस्।",
  },
  "escrow.sub": {
    en: "Press play. This is exactly what happens to every rupee on EverestBazar.",
    ne: "प्ले थिच्नुहोस्। एभरेस्टबजारमा हरेक रुपैयाँमा यही हुन्छ।",
  },
  "escrow.play": { en: "Play the flow", ne: "फ्लो चलाउनुहोस्" },
  "escrow.replay": { en: "Replay", ne: "फेरि चलाउनुहोस्" },
  "escrow.pause": { en: "Pause", ne: "रोक्नुहोस्" },
  "escrow.s1t": { en: "Buyer pays", ne: "खरिदकर्ताले तिर्छ" },
  "escrow.s1d": {
    en: "You pay EverestBazar — not the seller directly.",
    ne: "तपाईं एभरेस्टबजारलाई तिर्नुहुन्छ — सिधै बिक्रेतालाई होइन।",
  },
  "escrow.s2t": { en: "Held in escrow", ne: "एस्क्रोमा सुरक्षित" },
  "escrow.s2d": {
    en: "We lock the money. The seller can see it’s there, but can’t touch it yet.",
    ne: "हामी पैसा लक गर्छौं। बिक्रेताले देख्न सक्छन् तर अहिले छुन सक्दैनन्।",
  },
  "escrow.s3t": { en: "Seller ships", ne: "बिक्रेताले पठाउँछ" },
  "escrow.s3d": {
    en: "Knowing payment is secured, the seller sends your item.",
    ne: "भुक्तानी सुरक्षित छ भन्ने थाहा पाएर बिक्रेताले सामान पठाउँछन्।",
  },
  "escrow.s4t": { en: "You confirm", ne: "तपाईं पुष्टि गर्नुहुन्छ" },
  "escrow.s4d": {
    en: "Got exactly what was promised? Tap confirm. Not right? Open a dispute.",
    ne: "जे वाचा गरिएको थियो त्यही पाउनुभयो? पुष्टि थिच्नुहोस्। ठीक छैन? विवाद खोल्नुहोस्।",
  },
  "escrow.s5t": { en: "Seller is paid", ne: "बिक्रेतालाई भुक्तानी" },
  "escrow.s5d": {
    en: "Only now is the money released. Everyone wins — safely.",
    ne: "अब मात्र पैसा जारी हुन्छ। सबैको जित — सुरक्षित रूपमा।",
  },

  // ---- browse ----
  "browse.eyebrow": { en: "Live marketplace", ne: "प्रत्यक्ष बजार" },
  "browse.title": {
    en: "Browse verified listings.",
    ne: "प्रमाणित सामानहरू हेर्नुहोस्।",
  },
  "browse.searchPh": {
    en: "Search “iPhone”, “scooter”, “sofa”…",
    ne: "खोज्नुहोस् “आइफोन”, “स्कुटर”, “सोफा”…",
  },
  "browse.all": { en: "All", ne: "सबै" },
  "browse.verified": { en: "Verified", ne: "प्रमाणित" },
  "browse.escrow": { en: "Escrow", ne: "एस्क्रो" },
  "browse.empty": {
    en: "No listings match — try another search.",
    ne: "कुनै सामान मिलेन — अर्को खोजी प्रयास गर्नुहोस्।",
  },
  "browse.cta": { en: "See all listings", ne: "सबै सामान हेर्नुहोस्" },
  "browse.count": { en: "verified listings", ne: "प्रमाणित सामान" },

  // categories
  "cat.electronics": { en: "Electronics", ne: "इलेक्ट्रोनिक्स" },
  "cat.vehicles": { en: "Vehicles", ne: "सवारी" },
  "cat.furniture": { en: "Furniture", ne: "फर्निचर" },
  "cat.mobile": { en: "Mobiles", ne: "मोबाइल" },
  "cat.home": { en: "Home", ne: "घरायसी" },
  "cat.fashion": { en: "Fashion", ne: "फेसन" },

  // ---- seller form ----
  "sell.eyebrow": { en: "Become a seller", ne: "बिक्रेता बन्नुहोस्" },
  "sell.title": { en: "Get verified in three steps.", ne: "तीन चरणमा प्रमाणित हुनुहोस्।" },
  "sell.sub": {
    en: "This is the same check every seller passes. It’s why buyers trust the badge.",
    ne: "हरेक बिक्रेताले यही जाँच पास गर्छन्। त्यसैले खरिदकर्ताले ब्याजमा विश्वास गर्छन्।",
  },
  "sell.step1": { en: "Your details", ne: "तपाईंको विवरण" },
  "sell.step2": { en: "Identity", ne: "परिचय" },
  "sell.step3": { en: "Verified", ne: "प्रमाणित" },
  "sell.name": { en: "Full name", ne: "पूरा नाम" },
  "sell.namePh": { en: "e.g. Aarati Shrestha", ne: "जस्तै आरती श्रेष्ठ" },
  "sell.phone": { en: "Mobile number", ne: "मोबाइल नम्बर" },
  "sell.idnum": {
    en: "Citizenship / National ID number",
    ne: "नागरिकता / राष्ट्रिय परिचयपत्र नम्बर",
  },
  "sell.idnumPh": { en: "e.g. 12-01-78-04567", ne: "जस्तै १२-०१-७८-०४५६७" },
  "sell.upload": {
    en: "Upload front of your citizenship",
    ne: "नागरिकताको अगाडिको भाग अपलोड गर्नुहोस्",
  },
  "sell.uploadHint": {
    en: "Drag a photo here or tap to choose — encrypted, used only to verify you.",
    ne: "फोटो यहाँ तान्नुहोस् वा छान्न थिच्नुहोस् — इन्क्रिप्टेड, तपाईंलाई प्रमाणित गर्न मात्र प्रयोग हुन्छ।",
  },
  "sell.continue": { en: "Continue", ne: "अगाडि बढ्नुहोस्" },
  "sell.back": { en: "Back", ne: "पछाडि" },
  "sell.submit": { en: "Verify me", ne: "मलाई प्रमाणित गर्नुहोस्" },
  "sell.successT": { en: "You’re verified.", ne: "तपाईं प्रमाणित हुनुभयो।" },
  "sell.successD": {
    en: "Your seller badge is live. List your first item and get paid safely through escrow.",
    ne: "तपाईंको बिक्रेता ब्याज सक्रिय भयो। पहिलो सामान राख्नुहोस् र एस्क्रोमार्फत सुरक्षित भुक्तानी पाउनुहोस्।",
  },
  "sell.listNow": { en: "List your first item", ne: "पहिलो सामान राख्नुहोस्" },
  "sell.errName": { en: "Please enter your full name.", ne: "कृपया आफ्नो पूरा नाम लेख्नुहोस्।" },
  "sell.errPhone": {
    en: "Enter a valid 10-digit mobile number.",
    ne: "१० अंकको मान्य मोबाइल नम्बर लेख्नुहोस्।",
  },
  "sell.errId": { en: "Enter your citizenship number.", ne: "आफ्नो नागरिकता नम्बर लेख्नुहोस्।" },
  "sell.errFile": { en: "Please add a photo of your ID.", ne: "कृपया परिचयपत्रको फोटो थप्नुहोस्।" },
  "sell.fileAdded": { en: "Photo added", ne: "फोटो थपियो" },

  // ---- app cta ----
  "app.eyebrow": { en: "Get the app", ne: "एप लिनुहोस्" },
  "app.title": {
    en: "Carry the safest marketplace in your pocket.",
    ne: "सबैभन्दा सुरक्षित बजार आफ्नो खल्तीमा बोक्नुहोस्।",
  },
  "app.sub": {
    en: "Browse, chat, pay through escrow and track delivery — all from your phone.",
    ne: "किनमेल, कुराकानी, एस्क्रो भुक्तानी र डेलिभरी ट्र्याक — सबै तपाईंको फोनबाट।",
  },
  "app.ios": { en: "App Store", ne: "एप स्टोर" },
  "app.android": { en: "Google Play", ne: "गुगल प्ले" },
  "app.onApp": { en: "Download on the", ne: "डाउनलोड गर्नुहोस्" },
  "app.getOn": { en: "Get it on", ne: "यहाँ पाउनुहोस्" },

  // ---- footer ----
  "foot.tagline": {
    en: "Nepal’s highest standard in commerce.",
    ne: "व्यापारमा नेपालको सर्वोच्च मापदण्ड।",
  },
  "foot.c1": { en: "Marketplace", ne: "बजार" },
  "foot.c1a": { en: "Browse listings", ne: "सामान हेर्नुहोस्" },
  "foot.c1b": { en: "Categories", ne: "कोटिहरू" },
  "foot.c1c": { en: "How escrow works", ne: "एस्क्रो कसरी काम गर्छ" },
  "foot.c2": { en: "Sell", ne: "बेच्नुहोस्" },
  "foot.c2a": { en: "Become a seller", ne: "बिक्रेता बन्नुहोस्" },
  "foot.c2b": { en: "Seller protection", ne: "बिक्रेता सुरक्षा" },
  "foot.c2c": { en: "Fees", ne: "शुल्क" },
  "foot.c3": { en: "Trust & Safety", ne: "भरोसा र सुरक्षा" },
  "foot.c3a": { en: "Verification", ne: "प्रमाणीकरण" },
  "foot.c3b": { en: "Dispute resolution", ne: "विवाद समाधान" },
  "foot.c3c": { en: "Report fraud", ne: "ठगी उजुरी" },
  "foot.c4": { en: "Company", ne: "कम्पनी" },
  "foot.c4a": { en: "About", ne: "हाम्रोबारे" },
  "foot.c4b": { en: "Careers", ne: "करियर" },
  "foot.c4c": { en: "Contact", ne: "सम्पर्क" },
  "foot.madein": { en: "Built in Nepal", ne: "नेपालमा बनेको" },
  "foot.rights": {
    en: "© 2026 EverestBazar. All rights reserved.",
    ne: "© २०२६ एभरेस्टबजार। सर्वाधिकार सुरक्षित।",
  },

  // ---- header / account ----
  "nav.home": { en: "Home", ne: "गृह" },
  "nav.login": { en: "Log in", ne: "लग इन" },
  "nav.logout": { en: "Log out", ne: "लग आउट" },
  "nav.account": { en: "Account", ne: "खाता" },
  "nav.purchases": { en: "My purchases", ne: "मेरा खरिद" },
  "nav.sellCta": { en: "Sell an item", ne: "सामान बेच्नुहोस्" },

  // ---- conditions ----
  "cond.LIKE_NEW": { en: "Like New", ne: "झन्डै नयाँ" },
  "cond.GOOD": { en: "Good", ne: "राम्रो" },
  "cond.FAIR": { en: "Fair", ne: "ठिकै" },
  "cond.FOR_PARTS": { en: "For Parts", ne: "पार्ट्सका लागि" },

  // ---- browse page ----
  "bp.title": { en: "Browse the marketplace", ne: "बजार हेर्नुहोस्" },
  "bp.sub": {
    en: "Every listing is from a verified seller and protected by escrow.",
    ne: "हरेक सूची प्रमाणित बिक्रेताको हो र एस्क्रोले सुरक्षित छ।",
  },
  "bp.filters": { en: "Filters", ne: "फिल्टर" },
  "bp.condition": { en: "Condition", ne: "अवस्था" },
  "bp.price": { en: "Max price", ne: "अधिकतम मूल्य" },
  "bp.sort": { en: "Sort", ne: "क्रमबद्ध" },
  "bp.sortNew": { en: "Newest", ne: "नयाँ" },
  "bp.sortLow": { en: "Price: low to high", ne: "मूल्य: कमदेखि बढी" },
  "bp.sortHigh": { en: "Price: high to low", ne: "मूल्य: बढीदेखि कम" },
  "bp.clear": { en: "Clear all", ne: "सबै हटाउनुहोस्" },
  "bp.results": { en: "results", ne: "परिणाम" },
  "bp.empty": {
    en: "Nothing matches those filters yet.",
    ne: "ती फिल्टरसँग केही मिलेन।",
  },

  // ---- listing detail ----
  "ld.protected": { en: "Pakka Protected", ne: "पक्का सुरक्षित" },
  "ld.buy": { en: "Buy now", ne: "अहिले किन्नुहोस्" },
  "ld.message": { en: "Message seller", ne: "बिक्रेतालाई सन्देश" },
  "ld.guestNote": {
    en: "No account needed to buy — your payment is protected by escrow.",
    ne: "किन्न खाता चाहिँदैन — तपाईंको भुक्तानी एस्क्रोले सुरक्षित छ।",
  },
  "ld.condition": { en: "Condition", ne: "अवस्था" },
  "ld.about": { en: "About this item", ne: "यस सामानबारे" },
  "ld.specs": { en: "Details", ne: "विवरण" },
  "ld.showMore": { en: "Show more", ne: "थप हेर्नुहोस्" },
  "ld.showLess": { en: "Show less", ne: "कम हेर्नुहोस्" },
  "ld.seller": { en: "Seller", ne: "बिक्रेता" },
  "ld.viewProfile": { en: "View profile", ne: "प्रोफाइल हेर्नुहोस्" },
  "ld.sales": { en: "completed sales", ne: "पूरा बिक्री" },
  "ld.memberSince": { en: "Member since", ne: "सदस्य भएको" },
  "ld.more": { en: "More from this seller", ne: "यस बिक्रेताका थप" },
  "ld.related": { en: "Similar listings", ne: "उस्तै सामान" },
  "ld.report": { en: "Report this listing", ne: "यो सूची रिपोर्ट गर्नुहोस्" },
  "ld.back": { en: "Back to browse", ne: "किनमेलमा फर्कनुहोस्" },
  "ld.notFound": { en: "We couldn't find that listing.", ne: "त्यो सूची फेला परेन।" },
  "ld.photo": { en: "Photo", ne: "फोटो" },

  // ---- checkout ----
  "co.title": { en: "Secure checkout", ne: "सुरक्षित चेकआउट" },
  "co.item": { en: "Your item", ne: "तपाईंको सामान" },
  "co.howProtected": {
    en: "How your money is protected",
    ne: "तपाईंको पैसा कसरी सुरक्षित हुन्छ",
  },
  "co.p1": {
    en: "You pay EverestBazar — we hold your money safely.",
    ne: "तपाईं एभरेस्टबजारलाई तिर्नुहुन्छ — पैसा सुरक्षित राख्छौं।",
  },
  "co.p2": { en: "The seller delivers your item.", ne: "बिक्रेताले सामान पुर्‍याउँछन्।" },
  "co.p3": {
    en: "You confirm receipt — money is released to the seller.",
    ne: "तपाईं पुष्टि गर्नुहुन्छ — पैसा बिक्रेतालाई जान्छ।",
  },
  "co.p4": {
    en: "Problem? Raise a dispute for a full refund.",
    ne: "समस्या? पूर्ण फिर्ताका लागि विवाद खोल्नुहोस्।",
  },
  "co.contact": { en: "Your contact details", ne: "तपाईंको सम्पर्क विवरण" },
  "co.contactNote": {
    en: "Shared only with the verified seller to arrange delivery and send escrow updates.",
    ne: "डेलिभरी मिलाउन र एस्क्रो अपडेट पठाउन प्रमाणित बिक्रेतासँग मात्र साझा।",
  },
  "co.signedInAs": { en: "Signed in as", ne: "लग इन" },
  "co.delivery": { en: "Delivery", ne: "डेलिभरी" },
  "co.meet": { en: "Meet in person", ne: "भेटेर लिने" },
  "co.meetNote": {
    en: "Arrange a public pickup spot with the seller via chat.",
    ne: "बिक्रेतासँग च्याटमार्फत सार्वजनिक पिकअप स्थान मिलाउनुहोस्।",
  },
  "co.pathao": { en: "Pathao delivery", ne: "पठाओ डेलिभरी" },
  "co.soon": { en: "Coming soon", ne: "चाँडै" },
  "co.payment": { en: "Payment method", ne: "भुक्तानी विधि" },
  "co.itemPrice": { en: "Item price", ne: "सामानको मूल्य" },
  "co.escrowFee": { en: "EverestBazar protection fee", ne: "एभरेस्टबजार सुरक्षा शुल्क" },
  "co.total": { en: "Total", ne: "जम्मा" },
  "co.sellerFeeNote": {
    en: "5% seller fee is already included — not added to your total.",
    ne: "५% बिक्रेता शुल्क समावेश छ — तपाईंको जम्मामा थपिँदैन।",
  },
  "co.pay": { en: "Pay securely", ne: "सुरक्षित भुक्तानी" },
  "co.payNote": {
    en: "Held in escrow until you confirm delivery.",
    ne: "डेलिभरी पुष्टि नगरेसम्म एस्क्रोमा राखिन्छ।",
  },
  "co.processing": { en: "Securing your payment…", ne: "भुक्तानी सुरक्षित गर्दै…" },

  // ---- checkout result ----
  "cs.title": { en: "Payment secured!", ne: "भुक्तानी सुरक्षित!" },
  "cs.body": {
    en: "EverestBazar is holding your payment until you confirm delivery.",
    ne: "तपाईंले डेलिभरी पुष्टि नगरेसम्म एभरेस्टबजारले भुक्तानी राखेको छ।",
  },
  "cs.deadline": { en: "Confirm delivery by", ne: "डेलिभरी पुष्टि गर्ने मिति" },
  "cs.chat": { en: "Chat with the seller", ne: "बिक्रेतासँग कुराकानी" },
  "cs.browse": { en: "Keep browsing", ne: "किनमेल जारी राख्नुहोस्" },
  "cf.title": { en: "Payment was not completed", ne: "भुक्तानी पूरा भएन" },
  "cf.body": {
    en: "Nothing was charged. You can try again whenever you're ready.",
    ne: "केही शुल्क लागेन। तयार हुँदा फेरि प्रयास गर्न सक्नुहुन्छ।",
  },
  "cf.retry": { en: "Try again", ne: "फेरि प्रयास गर्नुहोस्" },
  "cf.support": { en: "Contact support", ne: "सहयोग सम्पर्क" },

  // ---- auth ----
  "au.welcome": { en: "Welcome to EverestBazar", ne: "एभरेस्टबजारमा स्वागत छ" },
  "au.loginSub": {
    en: "Sign in to buy or sell. Enter your email and we'll send a one-time code.",
    ne: "किन्न वा बेच्न लग इन गर्नुहोस्। इमेल लेख्नुहोस्, हामी एक-पटके कोड पठाउँछौं।",
  },
  "au.emailLabel": { en: "Email", ne: "इमेल" },
  "au.emailPh": { en: "you@example.com", ne: "you@example.com" },
  "au.errEmail": { en: "Enter a valid email address.", ne: "मान्य इमेल ठेगाना लेख्नुहोस्।" },
  "au.sendOtp": { en: "Send code", ne: "कोड पठाउनुहोस्" },
  "au.terms": {
    en: "By continuing you agree to our Terms of Service.",
    ne: "जारी राख्दा तपाईं हाम्रा सेवाका सर्तहरूमा सहमत हुनुहुन्छ।",
  },
  "au.otpTitle": { en: "Enter your code", ne: "कोड लेख्नुहोस्" },
  "au.otpSub": { en: "Sent to", ne: "पठाइयो" },
  "au.otpHint": { en: "Enter the code from your email.", ne: "इमेलमा आएको कोड लेख्नुहोस्।" },
  "au.resendIn": { en: "Resend in", ne: "पुनः पठाउनुहोस्" },
  "au.resend": { en: "Resend code", ne: "कोड पुनः पठाउनुहोस्" },
  "au.verify": { en: "Verify", ne: "प्रमाणित गर्नुहोस्" },
  "au.otpErr": { en: "That code isn't right — try again.", ne: "कोड मिलेन — फेरि प्रयास गर्नुहोस्।" },
  "au.changeNumber": { en: "Use a different email", ne: "अर्को इमेल प्रयोग गर्नुहोस्" },

  // ---- kyc ----
  "kyc.uploadTitle": { en: "Verify your identity", ne: "आफ्नो परिचय प्रमाणित गर्नुहोस्" },
  "kyc.uploadSub": {
    en: "Sellers verify once against their National ID. It's why buyers trust the badge.",
    ne: "बिक्रेताले एक पटक राष्ट्रिय परिचयपत्रबाट प्रमाणित हुन्छन्। त्यसैले ब्याजमा भरोसा हुन्छ।",
  },
  "kyc.front": { en: "Front of citizenship / NID", ne: "नागरिकता / परिचयपत्र अगाडि" },
  "kyc.back": { en: "Back of citizenship / NID", ne: "नागरिकता / परिचयपत्र पछाडि" },
  "kyc.why": { en: "Why do we need this?", ne: "किन चाहिन्छ?" },
  "kyc.whyBody": {
    en: "Your ID is used only to verify your identity. It's stored securely and never shared with buyers or sellers.",
    ne: "तपाईंको परिचयपत्र प्रमाणीकरणका लागि मात्र प्रयोग हुन्छ। सुरक्षित राखिन्छ, कसैसँग साझा गरिँदैन।",
  },
  "kyc.dropHint": {
    en: "Drag a photo here or tap to choose",
    ne: "फोटो यहाँ तान्नुहोस् वा छान्न थिच्नुहोस्",
  },
  "kyc.remove": { en: "Remove", ne: "हटाउनुहोस्" },
  "kyc.continue": { en: "Continue", ne: "अगाडि बढ्नुहोस्" },
  "kyc.selfieTitle": { en: "Take a selfie", ne: "सेल्फी खिच्नुहोस्" },
  "kyc.selfieSub": {
    en: "Match your face to your ID. Use your camera, or upload a clear photo.",
    ne: "अनुहार परिचयपत्रसँग मिलाउनुहोस्। क्यामेरा प्रयोग गर्नुहोस् वा स्पष्ट फोटो अपलोड गर्नुहोस्।",
  },
  "kyc.useCamera": { en: "Use camera", ne: "क्यामेरा प्रयोग गर्नुहोस्" },
  "kyc.capture": { en: "Capture", ne: "खिच्नुहोस्" },
  "kyc.retake": { en: "Retake", ne: "फेरि खिच्नुहोस्" },
  "kyc.orUpload": { en: "or upload a photo", ne: "वा फोटो अपलोड गर्नुहोस्" },
  "kyc.submit": { en: "Submit for review", ne: "समीक्षाका लागि पेस गर्नुहोस्" },
  "kyc.pendingTitle": { en: "Your ID is being reviewed", ne: "तपाईंको परिचयपत्र समीक्षामा छ" },
  "kyc.pendingBody": {
    en: "This usually takes 2–4 hours during business hours. You can keep browsing while you wait.",
    ne: "सामान्यतया कार्यालय समयमा २–४ घण्टा लाग्छ। पर्खंदा किनमेल गर्न सक्नुहुन्छ।",
  },
  "kyc.goBrowse": { en: "Go to browse", ne: "किनमेलमा जानुहोस्" },
  "kyc.demoApprove": { en: "Simulate approval (demo)", ne: "स्वीकृति नक्कल गर्नुहोस् (डेमो)" },
  "kyc.step": { en: "Step", ne: "चरण" },

  // ---- sell gate / create listing ----
  "sg.title": { en: "Sell on EverestBazar", ne: "एभरेस्टबजारमा बेच्नुहोस्" },
  "sg.needLogin": {
    en: "Sign in to start selling. It takes a minute.",
    ne: "बेच्न सुरु गर्न लग इन गर्नुहोस्। एक मिनेट लाग्छ।",
  },
  "sg.needKyc": {
    en: "One more step: verify your identity to start listing.",
    ne: "एक चरण बाँकी: सूची राख्न परिचय प्रमाणित गर्नुहोस्।",
  },
  "sg.verifyNow": { en: "Verify now", ne: "अहिले प्रमाणित गर्नुहोस्" },
  "new.title": { en: "Create a listing", ne: "सूची बनाउनुहोस्" },
  "new.sub": {
    en: "Add a few details and publish. You can edit anything later.",
    ne: "केही विवरण थपेर प्रकाशित गर्नुहोस्। पछि सम्पादन गर्न सकिन्छ।",
  },
  "new.photos": { en: "Photos", ne: "फोटोहरू" },
  "new.photosHint": {
    en: "Add at least 3. The first is your cover.",
    ne: "कम्तीमा ३ थप्नुहोस्। पहिलो कभर हो।",
  },
  "new.titleField": { en: "Listing title", ne: "सूचीको शीर्षक" },
  "new.titlePh": { en: "e.g. iPhone 13 128GB — Good condition", ne: "जस्तै आइफोन १३ १२८जीबी — राम्रो अवस्था" },
  "new.category": { en: "Category", ne: "कोटि" },
  "new.cond": { en: "Condition", ne: "अवस्था" },
  "new.price": { en: "Price (NPR)", ne: "मूल्य (रु)" },
  "new.desc": { en: "Description", ne: "विवरण" },
  "new.descPh": {
    en: "Condition, what's included, why you're selling…",
    ne: "अवस्था, के समावेश छ, किन बेच्दै…",
  },
  "new.youReceive": { en: "You receive after 5% fee", ne: "५% शुल्कपछि तपाईंले पाउने" },
  "new.publish": { en: "Publish listing", ne: "सूची प्रकाशित गर्नुहोस्" },
  "new.published": { en: "Listing published!", ne: "सूची प्रकाशित भयो!" },
  "new.minPhotos": { en: "Please add at least 3 photos.", ne: "कृपया कम्तीमा ३ फोटो थप्नुहोस्।" },
  "new.needTitle": { en: "Give your listing a title.", ne: "सूचीलाई शीर्षक दिनुहोस्।" },
  "new.needPrice": { en: "Enter a price.", ne: "मूल्य लेख्नुहोस्।" },

  // ---- account menu / nav ----
  "nav.profile": { en: "Profile", ne: "प्रोफाइल" },
  "nav.sales": { en: "My sales", ne: "मेरा बिक्री" },
  "nav.chat": { en: "Chat", ne: "च्याट" },
  "nav.adminKyc": { en: "KYC review", ne: "KYC समीक्षा" },

  // ---- dashboards (purchases / sales) ----
  "dash.purchases": { en: "My purchases", ne: "मेरा खरिद" },
  "dash.purchasesSub": {
    en: "Track every order from payment to delivery.",
    ne: "भुक्तानीदेखि डेलिभरीसम्म हरेक अर्डर ट्र्याक गर्नुहोस्।",
  },
  "dash.sales": { en: "My sales", ne: "मेरा बिक्री" },
  "dash.salesSub": {
    en: "Your sold items and escrow payouts.",
    ne: "तपाईंका बिक्री भएका सामान र एस्क्रो भुक्तानी।",
  },
  "dash.all": { en: "All", ne: "सबै" },
  "dash.pending": { en: "Pending", ne: "बाँकी" },
  "dash.completed": { en: "Completed", ne: "सम्पन्न" },
  "dash.disputed": { en: "Disputed", ne: "विवादित" },
  "dash.empty": { en: "Nothing here yet.", ne: "यहाँ अहिले केही छैन।" },
  "dash.earnings": { en: "Total received", ne: "जम्मा प्राप्त" },
  "dash.startBrowsing": { en: "Start browsing", ne: "किनमेल सुरु गर्नुहोस्" },

  // ---- escrow status ----
  "es.order": { en: "Order", ne: "अर्डर" },
  "es.paid": { en: "Paid", ne: "भुक्तानी" },
  "es.delivered": { en: "Delivered", ne: "पुर्‍याइयो" },
  "es.completed": { en: "Completed", ne: "सम्पन्न" },
  "es.timeleft": { en: "left to confirm", ne: "पुष्टि गर्न बाँकी" },
  "es.confirm": { en: "Confirm delivery", ne: "डेलिभरी पुष्टि गर्नुहोस्" },
  "es.confirmDone": {
    en: "Payment released to the seller. Thanks for using EverestBazar!",
    ne: "बिक्रेतालाई भुक्तानी जारी भयो। एभरेस्टबजार प्रयोग गर्नुभएकोमा धन्यवाद!",
  },
  "es.dispute": { en: "Raise a dispute", ne: "विवाद उठाउनुहोस्" },
  "es.awaiting": {
    en: "Awaiting delivery confirmation from the buyer.",
    ne: "खरिदकर्ताबाट डेलिभरी पुष्टिको प्रतीक्षामा।",
  },
  "es.payout": { en: "Your payout", ne: "तपाईंको भुक्तानी" },
  "es.underReview": { en: "Under review", ne: "समीक्षाधीन" },
  "es.review": { en: "Leave a review", ne: "समीक्षा लेख्नुहोस्" },
  "es.reviewed": { en: "Review submitted", ne: "समीक्षा पेस भयो" },
  "es.with": { en: "with", ne: "सँग" },

  // ---- profile ----
  "pf.title": { en: "Your profile", ne: "तपाईंको प्रोफाइल" },
  "pf.tabListings": { en: "My listings", ne: "मेरा सूची" },
  "pf.tabPurchases": { en: "Purchases", ne: "खरिद" },
  "pf.tabSales": { en: "Sales", ne: "बिक्री" },
  "pf.tabReviews": { en: "Reviews", ne: "समीक्षा" },
  "pf.joined": { en: "Joined", ne: "सामेल" },
  "pf.statSales": { en: "sales", ne: "बिक्री" },
  "pf.statPurchases": { en: "purchases", ne: "खरिद" },
  "pf.statRating": { en: "rating", ne: "रेटिङ" },
  "pf.newListing": { en: "New listing", ne: "नयाँ सूची" },
  "pf.noListings": {
    en: "You have no active listings yet.",
    ne: "तपाईंका सक्रिय सूची छैनन्।",
  },
  "pf.noReviews": { en: "No reviews yet.", ne: "अहिलेसम्म समीक्षा छैन।" },
  "pf.activeListings": { en: "Active listings", ne: "सक्रिय सूची" },
  "pf.loginNeeded": {
    en: "Sign in to view your profile.",
    ne: "प्रोफाइल हेर्न लग इन गर्नुहोस्।",
  },
  "pf.save": { en: "Save", ne: "सुरक्षित गर्नुहोस्" },
  "pf.bannerNone": {
    en: "Complete ID verification to buy faster and start selling.",
    ne: "छिटो किन्न र बेच्न परिचय प्रमाणित गर्नुहोस्।",
  },
  "pf.bannerPending": {
    en: "Your ID is being reviewed (2–4 hours).",
    ne: "तपाईंको परिचय समीक्षामा छ (२–४ घण्टा)।",
  },
  "pf.bannerRejected": {
    en: "Verification failed. Please try again.",
    ne: "प्रमाणीकरण असफल भयो। फेरि प्रयास गर्नुहोस्।",
  },

  // ---- dispute ----
  "dp.title": { en: "Raise a dispute", ne: "विवाद उठाउनुहोस्" },
  "dp.s1": { en: "What went wrong?", ne: "के बिग्रियो?" },
  "dp.r1": { en: "Item not received", ne: "सामान प्राप्त भएन" },
  "dp.r2": {
    en: "Item significantly different from the description",
    ne: "सामान विवरणभन्दा निकै फरक",
  },
  "dp.r3": {
    en: "Item damaged or not working as described",
    ne: "सामान बिग्रिएको वा वर्णनअनुसार नचल्ने",
  },
  "dp.s2": { en: "Describe the problem", ne: "समस्या वर्णन गर्नुहोस्" },
  "dp.descPh": {
    en: "Describe what happened in detail…",
    ne: "के भयो विस्तृत रूपमा लेख्नुहोस्…",
  },
  "dp.evidence": {
    en: "Upload evidence (optional, up to 5 photos)",
    ne: "प्रमाण अपलोड गर्नुहोस् (वैकल्पिक, ५ फोटोसम्म)",
  },
  "dp.s3": { en: "Review & submit", ne: "समीक्षा र पेस" },
  "dp.reason": { en: "Reason", ne: "कारण" },
  "dp.submit": { en: "Submit dispute", ne: "विवाद पेस गर्नुहोस्" },
  "dp.next": { en: "Continue", ne: "अगाडि बढ्नुहोस्" },
  "dp.back": { en: "Back", ne: "पछाडि" },
  "dp.doneTitle": { en: "Dispute submitted", ne: "विवाद पेस भयो" },
  "dp.doneBody": {
    en: "Our team will review your dispute within 24 hours. Your money is safely held until this is resolved.",
    ne: "हाम्रो टोलीले २४ घण्टाभित्र समीक्षा गर्नेछ। समाधान नहुँदासम्म तपाईंको पैसा सुरक्षित राखिन्छ।",
  },
  "dp.viewPurchases": { en: "View my purchases", ne: "मेरा खरिद हेर्नुहोस्" },
  "dp.reasonReq": { en: "Please choose a reason.", ne: "कृपया कारण छान्नुहोस्।" },
  "dp.descReq": { en: "Please describe the problem.", ne: "कृपया समस्या वर्णन गर्नुहोस्।" },

  // ---- chat ----
  "ch.title": { en: "Messages", ne: "सन्देशहरू" },
  "ch.empty": {
    en: "No messages yet. Find something to buy or sell!",
    ne: "अहिलेसम्म सन्देश छैन। किन्न वा बेच्न केही खोज्नुहोस्!",
  },
  "ch.inputPh": { en: "Write a message…", ne: "सन्देश लेख्नुहोस्…" },
  "ch.makeOffer": { en: "Make offer", ne: "प्रस्ताव गर्नुहोस्" },
  "ch.offer": { en: "Offer", ne: "प्रस्ताव" },
  "ch.yourOffer": { en: "Your offer", ne: "तपाईंको प्रस्ताव" },
  "ch.sendOffer": { en: "Send offer", ne: "प्रस्ताव पठाउनुहोस्" },
  "ch.accept": { en: "Accept", ne: "स्वीकार" },
  "ch.decline": { en: "Decline", ne: "अस्वीकार" },
  "ch.offerAccepted": {
    en: "Offer accepted — proceed to checkout.",
    ne: "प्रस्ताव स्वीकृत — चेकआउटमा जानुहोस्।",
  },
  "ch.offerDeclined": { en: "Offer declined.", ne: "प्रस्ताव अस्वीकृत।" },
  "ch.blocked": {
    en: "Contact details removed — keep transactions safe on EverestBazar.",
    ne: "सम्पर्क विवरण हटाइयो — एभरेस्टबजारमा कारोबार सुरक्षित राख्नुहोस्।",
  },
  "ch.viewListing": { en: "View listing", ne: "सूची हेर्नुहोस्" },
  "ch.proceed": { en: "Proceed to checkout", ne: "चेकआउटमा जानुहोस्" },

  // ---- admin kyc ----
  "ad.title": { en: "KYC review", ne: "KYC समीक्षा" },
  "ad.sub": { en: "Pending seller verifications", ne: "बाँकी बिक्रेता प्रमाणीकरण" },
  "ad.none": { en: "No pending applications.", ne: "कुनै बाँकी आवेदन छैन।" },
  "ad.submitted": { en: "Submitted", ne: "पेस मिति" },
  "ad.nidFront": { en: "NID front", ne: "परिचयपत्र अगाडि" },
  "ad.nidBack": { en: "NID back", ne: "परिचयपत्र पछाडि" },
  "ad.selfie": { en: "Selfie", ne: "सेल्फी" },
  "ad.approve": { en: "Approve", ne: "स्वीकृत गर्नुहोस्" },
  "ad.reject": { en: "Reject", ne: "अस्वीकृत गर्नुहोस्" },
  "ad.rejectReason": { en: "Reason for rejection", ne: "अस्वीकृतिको कारण" },
  "ad.approved": { en: "Approved", ne: "स्वीकृत भयो" },
  "ad.rejected": { en: "Rejected", ne: "अस्वीकृत भयो" },
  "ad.denied": { en: "Admins only.", ne: "प्रशासकका लागि मात्र।" },
  "ad.notify": {
    en: "WhatsApp notification sent to the applicant (demo).",
    ne: "आवेदकलाई ह्वाट्सएप सूचना पठाइयो (डेमो)।",
  },

  // ---- relative time units (ne) ----
  "time.now": { en: "Just now", ne: "अहिले" },
  "time.min": { en: "m ago", ne: " मिनेट अघि" },
  "time.hour": { en: "h ago", ne: " घण्टा अघि" },
  "time.day": { en: "d ago", ne: " दिन अघि" },
} satisfies Record<string, Bilingual>;

export type StringKey = keyof typeof STRINGS;
