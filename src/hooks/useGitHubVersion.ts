import { useState, useEffect } from 'react';

export function useGitHubVersion(repo: string = 'danloi2/itercatholicum') {
  const [version, setVersion] = useState<string>('1.1.0');

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.tag_name) {
          setVersion(data.tag_name);
        }
      })
      .catch((err) => {
        // Fallback or silent error for rate limits (403)
        console.warn('Could not fetch latest version from GitHub:', err.message);
      });
  }, [repo]);

  return version;
}
