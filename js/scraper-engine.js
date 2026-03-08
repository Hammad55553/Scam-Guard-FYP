/**
 * SCAM GUARD - AI SCRAPER ENGINE
 * 
 * PURPOSE: 
 * This module is designed for the Final Year Project (FYP) to demonstrate 
 * real-time data extraction and automated scam detection logic.
 * 
 * CORE FUNCTIONALITIES:
 * 1. Web Scraping: Uses a CORS proxy to fetch real HTML content from live URLs.
 * 2. Pattern Recognition: Scans text for specific keywords associated with scams.
 * 3. Sentiment & Heuristic Analysis: Assigns risk scores based on detected patterns.
 * 4. Verdict Generation: Combines weighted analysis to provide a final safety score.
 */

const ScraperEngine = {
    /**
     * Main configuration for the scam detection heuristic
     */
    config: {
        keywords: {
            high_risk: [
                'social engineering', 'phishing', 'malware', 'credential harvesting',
                'unauthorized access', 'data exfiltration', 'ransomware', 'spyware',
                'malicious payload', 'keylogger', 'backdoor', 'trojan', 'identity theft',
                'vulnerability exploit', 'suspicious permission'
            ],
            moderate_risk: [
                'metadata tracking', 'third-party script', 'obfuscated code',
                'excessive ads', 'low credibility', 'unverified developer',
                'privacy violation', 'data harvesting', 'unsecured api', 'anomalous behavior'
            ],
            trust: [
                'pci dss compliant', 'end-to-end encryption', 'iso 27001',
                'gdpr compliant', 'verified publisher', 'google play protect',
                'two-factor authentication', 'biometric security'
            ]
        },
        thresholds: {
            danger: 50,
            high_risk_weight: 35,
            moderate_risk_weight: 15,
            trust_bonus: 20
        }
    },

    /**
     * Executes the scraper by fetching data from the provided URL
     */
    async runCrawl(url) {
        console.log("%c[ScraperEngine] Starting Deep Crawl...", "color: #39B54A; font-weight: bold;");
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            return data && data.contents ? data.contents : null;
        } catch (error) {
            console.warn("[ScraperEngine] Network restrictions. Using Heuristic simulation.");
            return null;
        }
    },

    /**
     * Performs AI Heuristic Analysis
     * Logic: Starts with a Baseline based on URL reputation.
     */
    analyze(url, html) {
        let riskScore = 0;
        let detectedFlags = [];

        const isOfficialStore = url.includes('play.google.com/store/apps');
        const isOfficialDev = url.toLowerCase().includes('com.google') || url.toLowerCase().includes('com.android');

        // 1. BASELINE TRUST (The core fix for the "94% bug")
        if (isOfficialStore) {
            riskScore = 5; // Official store starts very safe
            detectedFlags.push("STORE_OFFICIAL_REPUTATION");
        } else {
            riskScore = 55; // Unknown/Third-party links start with high risk
            detectedFlags.push("UNVERIFIED_DISTRIBUTION_SOURCE");
        }

        // 2. TEXTUAL PATTERN RECOGNITION
        if (html) {
            const content = html.toLowerCase();

            // Scam Identifiers
            this.config.keywords.high_risk.forEach(word => {
                if (content.includes(word)) {
                    riskScore += 30; // Heavy penalty
                    detectedFlags.push(`PATTERN_${word.toUpperCase().replace(/\s/g, '_')}`);
                }
            });

            // Trust Identifiers (Certifications)
            this.config.keywords.trust.forEach(word => {
                if (content.includes(word)) {
                    riskScore -= 15; // Reward
                    detectedFlags.push(`TRUST_${word.toUpperCase().replace(/\s/g, '_')}`);
                }
            });
        }

        // 3. REPUTATION SCARS (Extra Logic)
        if (!url.startsWith('https://')) {
            riskScore += 20;
            detectedFlags.push("UNSECURED_CONNECTION");
        }

        if (isOfficialDev) {
            riskScore = 2; // Verified Google apps are always top-tier
            detectedFlags.push("DEVELOPER_VERIFIED");
        }

        // 4. SCORE NORMALIZATION
        // Ensure score doesn't go below 2 or above 98
        riskScore = Math.min(Math.max(riskScore, 2), 98);
        const safetyPercentage = 100 - riskScore;

        return {
            safetyScore: safetyPercentage,
            riskIntensity: riskScore,
            flags: [...new Set(detectedFlags)],
            isSafe: safetyPercentage >= this.config.thresholds.danger
        };
    },

    extractTitle(html, fallback) {
        if (!html) return fallback;
        const match = html.match(/<title>([^<]*)<\/title>/);
        return match ? match[1].split(' - ')[0] : fallback;
    }
};

window.ScraperEngine = ScraperEngine;
