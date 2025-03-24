import express from 'express';
import fetch from 'node-fetch';
import https from 'https';
import { URL } from 'url';

// Initialize Express app
const app = express();

async function checkURL(urlToCheck) {
    // Ensure the URL always has a scheme (http:// or https://)
    if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck; // Add https:// if no scheme is present
    }

    const agent = new https.Agent({ rejectUnauthorized: false }); // Disable SSL certificate verification
    try {
        const response = await fetch(urlToCheck, {
            redirect: 'manual', // Do not follow redirects automatically
            agent: agent, // Use agent for SSL
        });

        // Check response status and log for debugging
        console.log(`Status for ${urlToCheck}: ${response.status}`);
        console.log(`Location header: ${response.headers.get('location')}`);

        const originalDomain = getRootDomain(new URL(urlToCheck).hostname);

        // Check the response status code
        if (response.status >= 300 && response.status < 400) {
            const redirectLocation = response.headers.get('location');
            if (redirectLocation) {
                const redirectURL = new URL(redirectLocation, urlToCheck); // Handle relative URLs
                const redirectDomain = getRootDomain(redirectURL.hostname);

                // Check if the redirect leads to a different domain (not just a subdomain)
                if (redirectDomain !== originalDomain) {
                    console.log(`Redirect to a different domain: ${redirectDomain} != ${originalDomain}`);
                    return { blocked: true }; // Redirect to a different domain is considered blocked
                } else {
                    console.log(`Redirect to the same subdomain: ${redirectDomain} == ${originalDomain}`);
                    return { blocked: false }; // Redirect to the same subdomain is considered safe
                }
            } else {
                console.log(`Status ${response.status} without Location header.`);
                return { blocked: true }; // No Location header, considered blocked
            }
        } else if (response.status === 403) {
            console.log(`URL returned 403: ${urlToCheck}`);
            return { blocked: false }; // Status 403 is not considered blocked
        } else if (response.ok) {
            console.log(`URL is safe: ${urlToCheck}`);
            return { blocked: false }; // No issues, URL is safe
        } else {
            console.log(`URL not available (status ${response.status}): ${urlToCheck}`);
            return { blocked: true }; // URL not available, considered blocked
        }
    } catch (error) {
        console.log(`An error occurred while checking ${urlToCheck}: ${error.message}`);
        return { blocked: false }; // An error occurred, considered blocked
    }
}

// Define route to check domain status
app.get('/', async (req, res) => {
    const domainParam = req.query.domain;
    const domainsParam = req.query.domains;

    // If the "domain" parameter contains multiple domains, instruct to use "domains" instead
    if (domainParam && domainParam.includes(',')) {
        console.log('Multiple domains provided in "domain" parameter.');
        return res.status(400).json({ error: 'For multiple domains, please use the "domains" parameter.' });
    }

    let domains = [];
    if (domainsParam) {
        // Split the comma-separated list and remove any extra whitespace
        domains = domainsParam.split(',').map(d => d.trim()).filter(d => d.length > 0);
    } else if (domainParam) {
        domains = [domainParam];
    } else {
        console.log('Parameter "domain" or "domains" not provided.');
        return res.status(400).json({ error: 'Parameter "domain" or "domains" must be provided.' });
    }

    console.log(`Received check request for domains: ${domains.join(', ')}`);

    // Process each domain and gather results
    const results = {};
    for (const d of domains) {
        const result = await checkURL(d);
        results[d] = result;
    }

    res.json(results);
    console.log(`Sending response: ${JSON.stringify(results)}`);
});

// Run the server on port 3000
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
