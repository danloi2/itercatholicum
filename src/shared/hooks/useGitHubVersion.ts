import packageJson from '../../../package.json';

export function useGitHubVersion() {
  return packageJson.version;
}
