import { useState, useEffect } from 'react';

// Singleton-like cache to avoid multiple requests and handle rate limiting
let cachedVersion: string | null = null;
let isRateLimited = false;

export function useGitHubVersion(repo: string = 'danloi2/itercatholicum') {
  const [version, setVersion] = useState<string>(cachedVersion || '1.1.0');

  useEffect(() => {
    // If we already have a version or know we are rate limited, don't fetch
    if (cachedVersion || isRateLimited) return;

    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
      .then((res) => {
        if (res.status === 403) {
          isRateLimited = true;
          throw new Error('Rate limited');
        }
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.tag_name) {
          cachedVersion = data.tag_name;
          setVersion(data.tag_name);
        }
      })
      .catch((err) => {
        // Silent error for rate limits or other issues to avoid console noise
        if (err.message !== 'Rate limited') {
          console.warn('GitHub Version Fetch:', err.message);
        }
      });
  }, [repo]);

  return version;
}
