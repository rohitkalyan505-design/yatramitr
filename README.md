# YATRAMITR

> **Next-generation cultural immersion and sustainable tourism platform for Hyderabad (SIH Demo)**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://yatramitr-ejn35dj8n-deadas.vercel.app)
[![SIH 2026](https://img.shields.io/badge/SIH_2026-Demo_Prototype-orange?style=flat-square)](https://github.com/rohitkalyan505-design/yatramitr)

YATRAMITR is a smart, responsible tourism and cultural immersion platform engineered for Hyderabad and Telangana. It bridges the gap between discerning travellers and authentic local experiences, empowering local storytellers (Mitras), promoting lesser-known heritage landmarks, curbing exploitative pricing, and channelling tourism revenue directly into local communities.

---

## 🌐 Live Website

The full application is deployed live in production on Vercel:

### [🚀 Visit YATRAMITR Live Website](https://yatramitr-ejn35dj8n-deadas.vercel.app)

*Production URL:* `https://yatramitr-ejn35dj8n-deadas.vercel.app`

---

## 🎯 Problem

Modern urban and heritage tourism faces critical systemic imbalances:

* **Hyper-concentration around marquee sites:** Footfall is overwhelmingly clustered around a few mainstream monuments, leaving high-value historic and cultural sites overlooked and underfunded.
* **Marginalization of lesser-known destinations:** Lesser-known stepwells, tombs, craft clusters, and weaving villages struggle for visibility despite immense heritage value.
* **Shallow tourist experiences:** Visitors often skim monuments without understanding living traditions, architectural nuance, or authentic community narratives.
* **Scarcity of trusted local guides:** Travellers struggle to find genuine, knowledgeable local guides (*Mitras*) who uphold ethical practices and fair representation.
* **Pricing ambiguity & safety concerns:** Unregulated rates for local transit, shopping, and tours cause anxiety, while first-time visitors lack readily accessible localized safety guidance.
* **Economic leakage from host communities:** Mainstream tourism platforms capture bulk margins, offering minimal economic uplift to the grassroots custodians of heritage.

---

## 💡 Solution

YATRAMITR re-architects the tourism journey through a decentralized, community-first ecosystem:

$$\text{Traveller} \longrightarrow \text{Curated Destination} \longrightarrow \text{Local Mitra} \longrightarrow \text{Authentic Experience} \longrightarrow \text{Community Impact}$$

1. **Intelligent Discovery:** Balances tourist flow by spotlighting lesser-known cultural assets alongside major landmarks with verified historical contexts.
2. **Human Connection:** Matches travellers with passionate local guides who share oral histories, regional culinary arts, and artisan craftsmanship.
3. **Fairness & Transparency:** Provides benchmark price intelligence and transparent trust badges to eliminate friction and exploitation.
4. **Direct Economic Reinvestment:** Connects tourist expenditure directly with artisan clusters, neighbourhood eateries, and local guides.

---

## ✨ Key Features

All features listed below are actively implemented in the application:

* **Find My Yatra:** A multi-factor recommendation engine matching travel style, budget, party size, duration, and thematic interests to customized itineraries.
* **Personalized Recommendations:** Deterministic algorithmic scoring (interests, crowd preference, budget alignment, duration feasibility) providing transparent match breakdowns and explanations.
* **Hyderabad Destination Discovery:** Comprehensive exploration across 6 curated heritage categories, detailing history, legend distinctions, architectural highlights, and visiting guidelines.
* **Food Discovery:** Curated culinary trails covering iconic Hyderabadi dishes (Biryani, Haleem, Irani Chai, Osmania biscuits, Pathar ka Gosht) with authentic eateries and fair cost benchmarks.
* **Local Mitra Matching:** Search and filter community guides by spoken languages (Telugu, Hindi, Urdu, English), thematic specialties, and geographic zones.
* **Trust Passport:** Transparent guide credentials showcasing verification badges, bio, language proficiency, safety pledges, and verified traveller ratings.
* **Fair Price Guide & Price Check:** Real-time indicative price validator for auto-rickshaws, souvenirs, street food, and guided walks to protect travellers from arbitrary surcharges.
* **Booking Requests:** Streamlined booking flow to request slots with local Mitras, manage party details, and schedule custom tours.
* **Ask Mitra AI:** Groq-powered conversational AI assistant strictly grounded in the platform's verified destination dataset to assist visitors without hallucinating unsupported places or rates.
* **Live Trip Timeline:** Active journey management screen with sequential checkpoints, navigation links, and trip status tracking.
* **Safety Tools & Emergency Directory:** Instant one-tap access to local emergency contacts (Telangana Police 100, Women Helpline 181/1091, Medical Emergency 108, Tourist Police) alongside practical on-ground safety advisories.
* **Verified Reviews:** Credible feedback mechanism restricted to travellers who have completed an actual booking on the platform.
* **Community Impact Tracking:** Real-time tracking of direct local spending, craft preservation impact, and local livelihood contributions.
* **Become a Mitra:** An onboarding workflow enabling local storytellers, historians, and certified guides to apply, complete profiles, and join the platform network.
* **Interactive Map Discovery:** Dynamic MapLibre GL map powered by MapTiler vector tiles and OSRM routing displaying verified heritage clusters across Hyderabad.

---

## 🗺️ Hyderabad Destinations

The platform incorporates an authored, curated dataset of 24 destination experiences across Hyderabad and Telangana structured around 6 thematic heritage categories:

1. **Qutb Shahi & Hyderabad Origins:** Charminar, Golconda Fort, Qutb Shahi Tombs, Paigah Tombs, Badshahi Ashurkhana, Purani Haveli.
2. **Asaf Jahi (Nizami) Splendour:** Chowmahalla Palace, Falaknuma Palace, Nizam's Museum, Moazzam Jahi Market.
3. **Kakatiya Dynasty & Heritage:** Ramappa Temple (UNESCO World Heritage), Warangal Fort & Kakatiya Kala Thoranam, Thousand Pillar Temple, Bhadrakali Temple.
4. **Spiritual, Sacred & Ancient:** Mecca Masjid, Birla Mandir, Chilkur Balaji Temple, Moula Ali Dargah, Keesaragutta Temple.
5. **Cultural, Craft & Living Traditions:** Shilparamam Cultural Society, Laad Bazaar, Salar Jung Museum, Pochampally Handloom Village.
6. **Nature, Lakes & Modern Telangana:** Hussain Sagar & Buddha Statue, Ananthagiri Hills.

*Data Integrity Note:* Each place is tagged with explicit coordinates, architectural highlights, honest legend vs. documented history distinctions, and verification status indicators.

---

## 🤖 AI (Ask Mitra)

**Ask Mitra** is an intelligent assistant designed to assist travellers before and during their trip:

* **Engine:** Powered by Groq's high-speed inference engine.
* **Grounded Intelligence:** Responses are strictly conditioned on YATRAMITR's verified tourism dataset (places, price ranges, safety tips, culinary traditions).
* **Hallucination Safeguards:** Explicitly instructed never to invent unsupported locations, fake ticket prices, unverified ratings, or false certifications.
* **Deterministic Fallback:** Automatically switches to structured local rule-based recommendations if external AI APIs are unreachable or offline.

---

## 🧑‍🤝‍🧑 Local Mitras

**Mitras** are local residents, heritage enthusiasts, historians, and cultural ambassadors:

* **Community-Led Representation:** Empowers locals to guide visitors through their own neighborhoods and heritage lanes.
* **Trust Passport:** Every Mitra profile features a structured Trust Passport documenting identity status, verified languages, experience badges, and ethical conduct pledges.
* **Fair Earnings:** Connects guides directly with visitors to ensure fair compensation without extractive intermediary fees.

---

## 💰 Fair Pricing

The **Fair Price Guide** and **Price Check** tools eliminate uncertainty and protect both travellers and honest vendors:

* Provides indicative, realistic market price bands for daily essentials, transit (auto-rickshaws by meter/distance), heritage souvenirs (Laad Bazaar bangles, Bidriware, Pochampally sarees), and dining.
* Clearly labeled as **indicative local guidance** rather than legally mandated statutory tariffs, encouraging respectful negotiations and fair wages.

---

## 🛡️ Safety

YATRAMITR embeds proactive traveller safety directly into the user interface:

* Dedicated **Safety Directory** with direct-dial emergency services for Hyderabad & Telangana:
  * Police Control Room (`100`)
  * Women Helpline (`181` / `1091` / SHE Teams)
  * Medical Ambulance (`108`)
  * National Emergency Support (`112`)
* Local transit guidelines, safe travel advice for solo and female travellers, night-time navigation precautions, and verified local precinct contacts.

---

## 🏗️ Technology Stack

YATRAMITR is built on a modern, robust, full-stack web architecture:

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 14** (App Router), **React 18** |
| **Language & Typing** | **TypeScript 5.6** |
| **Styling & UI** | **Tailwind CSS**, **Lucide Icons** |
| **3D & Graphics** | **Three.js**, **React Three Fiber (@react-three/fiber)**, **Drei** |
| **Authentication** | **Firebase Authentication** (with secure session support) |
| **Database** | **Firebase Firestore** (dual-layer with local fallback resilience) |
| **Storage** | **Supabase Storage** (cloud media and asset handling) |
| **Generative AI** | **Groq SDK** (fast, low-latency grounded LLM inference) |
| **Interactive Mapping** | **MapLibre GL**, **MapTiler** (vector tile styling) |
| **Routing & Directions** | **OSRM** (Open Source Routing Machine API) |
| **Deployment & Hosting** | **Vercel** (Edge network, automated CI/CD) |

---

## 🚀 Deployment

Both the Next.js frontend application and the backend API routes run unified in production on Vercel:

* **Production URL:** [https://yatramitr-ejn35dj8n-deadas.vercel.app](https://yatramitr-ejn35dj8n-deadas.vercel.app)
* **GitHub Repository:** [https://github.com/rohitkalyan505-design/yatramitr](https://github.com/rohitkalyan505-design/yatramitr)

---

## 🏆 SIH 2026

YATRAMITR is developed as a working prototype and solution demo for the **Smart India Hackathon (SIH) 2026**.

The project tackles the challenge of sustainable, culturally immersive, and economically inclusive tourism by combining localized data grounding, community guide empowerment, fair price transparency, and modern web technologies.

---

## ⚠️ Demo / Prototype Notice

* **Demonstration Scope:** YATRAMITR is currently an MVP / proof-of-concept demonstration designed for the Smart India Hackathon 2026 showcase.
* **Pricing & Timings:** All price checks, guide tariffs, and transit fares represent indicative regional benchmarks for travel planning and are not formal commercial quotes.
* **Government Affiliation:** The project is an independent student hackathon innovation and does not claim official endorsement or certification by the Telangana Tourism Department or Archaeological Survey of India (ASI).
* **Payment Processing & GPS:** Financial checkout transactions and live GPS tracking shown in demonstrations are simulated prototype workflows and do not execute live banking transactions.

---

## 📄 License & Attribution

Developed for SIH 2026. Destination history and narratives reference documented historical sources, state gazetteers, and local cultural guides.
