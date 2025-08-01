import { bbdBursarUrl, adminUrl } from "../../../../theme/theme";

export function getLogo(): string {
    return !(bbdBursarUrl(window.location.href) || adminUrl(window.location.href)) ? "../../../assets/nav-bar-logo-white.svg" : "../../../assets/unleash-potential.svg"
  }