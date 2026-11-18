# SnugFit — Lazy Workouts

A single-page web app for short, low-effort workouts at home, plus walk prompts that fit your day and the weather. No jumping.

**Test it:** https://claude.ai/artifact/HA3sXo8DtENd7cBZ3Uh4TJ (private to you). Live weather and the Apple Health Shortcut can't work in this preview; see "Hosting" below.

## What's in v2
- **Ongoing program.** There's no end date. Each week is Core, House Circuit, Full Body, Rest & Stretch, Gentle Burn, Weekend Home Mover and a Long Walk. Moves change daily. There are 6 levels, and after 10 sessions the app offers the next one. You can also go up or down by hand.
- **Around-the-house and stair moves.** You pick your home type (apartment, one floor, two floors, split-level) and whether you have stairs. House circuits use the hallway, kitchen counter, walls and doorways, and add stairs if you have them.
- **Walk coach.** It suggests a walk after breakfast, lunch and dinner (meal times are editable), or an evening stroll if you're short of your daily walking goal. Walk length follows your level. Guided walks run warm-up, brisk and easy intervals with voice cues. Indoor walks loop the house and add stair climbs.
- **Weather and what to wear** (Open-Meteo, free, no key; defaults to Calgary). The app shows feels-like temperature, wind, snow and rain, ice risk on freeze-thaw (chinook) days, UV and darkness. It recommends layers, says go, take care, or walk indoors, and suggests the best time to walk today. If live weather can't load, you can enter the temperature and conditions yourself.
- **Challenges (optional).** A different weekly challenge each week (After-Meal Walker, Stair Week, 100-Minute Walk Week, and others), plus longer ones: Core Comeback (the original 28-day plan), 14-Day Walk Streak, 30-Day Home Mover and 1,000 Walking Minutes.
- **Weight & waist check-ins (v2.1).** A weekly reminder on Today, a check-in form, trend charts for weight and waist (tap a point to see its value), an optional goal weight with a progress bar, lb/kg and in/cm units, and a table of all check-ins. The Apple Health Shortcut can also send weight (`&weight=`).
- **Air quality (v2.1).** Wildfire smoke and other poor air (US AQI from Open-Meteo) shortens or moves walks indoors.
- **Steps.** Enter steps by hand, or sync them from Apple Health (including Apple Watch) with an iPhone Shortcut that opens `…/index.html?steps=1234`. The steps are in the app under Me → Connect.

## Hosting (needed for live weather and the Health Shortcut)
The claude.ai preview blocks calls to outside websites. To use those features, put `index.html` on any static host:
- GitHub Pages: needs a public repo, or a GitHub Pro plan for a private repo.
- Netlify Drop (app.netlify.com/drop): drag the `snugfit` folder in.
- On a computer you can also just open `index.html` in a browser; live weather works there.

## Known limits
- Full Apple Health / Apple Watch, Google Health Connect, and lock-screen reminders need a native app (for example a Capacitor wrapper).
- Data is saved in the browser only (`localStorage`). There's no account or sync yet.
