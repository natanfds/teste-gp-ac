import { regexUUID } from '../constants/regex';

export function maskUrl(url: string) {
  return url.replace(regexUUID, () => {
    return '*';
  });
}
