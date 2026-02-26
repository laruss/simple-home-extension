Simple Home Page transforms your new tab into a clean, distraction-free workspace.

**SMART NAVIGATION**
Type a search query or enter a URL directly. Simple Home Page automatically detects websites (like "github.com") and
takes you there without an extra search step.

**QUICK ACCESS BOOKMARKS**
Add your favorite sites with automatic title and favicon fetching, plus optional custom icon uploads. Organize them with
drag controls, delete what you don't need, and resize to your preference (small, medium, or large). Bookmarks are stored
locally.

**SYNCED SETTINGS**
Your search engine choice syncs across all Chrome browsers where you're signed in.

**MINIMAL & FAST**
No clutter. No distractions. Just a beautiful background, your search bar, and your bookmarks. Loads instantly every
time you open a new tab.

**PRIVACY FRIENDLY**
We don't track you. The only permission we need is to fetch website info when you add bookmarks.

## Search Justification

This extension overrides Chrome's new tab page and provides a search bar as a core feature, replacing the default new
tab search functionality. It uses the chrome.search API to send user-entered queries to Chrome's default search engine,
preserving the user's existing search engine preference. Search is triggered exclusively by explicit user action (
pressing Enter or clicking the search button). The extension does not construct search URLs, override search engine
settings, intercept search traffic, or collect any search data.

## Privacy Justification

This extension requires host permissions solely to fetch website metadata (page title and favicon) when users add
bookmarks. No browsing data is collected, stored remotely, or shared. All data remains in Chrome's local/sync storage.

## Keywords

new tab, homepage, search, bookmarks, minimal, productivity, custom new tab
