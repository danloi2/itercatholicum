import { useState, useEffect } from 'react';

export function useGitHubVersion(repo: string = 'danloi2/calitur') {
  const [version, setVersion] = useState<string>('0.1.0 (Alpha)');

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tag_name) {
          setVersion(data.tag_name);
        }
      })
      .catch((err) => console.error('Failed to fetch version:', err));
  }, [repo]);

  return version;
}
