# Privacy Policy for Simple Home Page

**Last updated:** January 2025

## Overview

Simple Home Page is a Chrome extension that replaces your new tab page with a minimal homepage featuring search and bookmarks. We are committed to protecting your privacy.

## Data Collection

### What We Collect

Simple Home Page stores the following data **locally** in your browser using Chrome's Storage API:

- **Search engine preference** - Your selected default search engine
- **Bookmarks** - URLs, titles, and favicon URLs of sites you manually add
- **Display preferences** - Bookmark size setting

### What We Do NOT Collect

- Personal information (name, email, address)
- Browsing history
- Authentication credentials
- Location data
- Financial information
- Health information
- Any data from websites you visit

## Data Storage

All data is stored locally using Chrome's `chrome.storage.sync` API. This means:

- Data stays on your device and in your Google account (if Chrome sync is enabled)
- Data syncs across your Chrome browsers where you're signed in
- We have no access to this data
- No data is sent to our servers (we don't have servers)

## Permissions

### Storage Permission

Used to save your preferences and bookmarks locally in Chrome's storage.

### Host Permission (`<all_urls>`)

Used **only** when you explicitly add a bookmark. When you click "Fetch & Add", the extension:

1. Fetches the webpage to extract its title
2. Retrieves the favicon from Google's favicon service

This happens only on user action and no browsing activity is monitored.

## Third-Party Services

The extension uses Google's favicon service (`google.com/s2/favicons`) to display website icons. No personal data is shared with this service.

## Data Sharing

We do not:

- Sell your data
- Share your data with third parties
- Use your data for advertising
- Transfer your data for any purpose unrelated to the extension's functionality

## Your Rights

Since all data is stored locally in your browser, you have full control:

- **View your data** - Check Chrome's extension storage
- **Delete your data** - Uninstall the extension or clear extension data in Chrome settings
- **Export your data** - Data syncs with your Google account if Chrome sync is enabled

## Changes to This Policy

If we make changes to this privacy policy, we will update the "Last updated" date above.

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository:

https://github.com/laruss/simple-home-extension

## Summary

**Simple Home Page does not collect, store, or transmit any personal data. All user preferences and bookmarks are stored locally in your browser.**
