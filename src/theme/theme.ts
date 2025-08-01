export enum Themes {
    ukukhula = 'ukukhula.bbd.co.za',
    bbd = 'bursary.bbd.co.za',
    admin = 'bbdbursaries.bbd.co.za',
    ukukhulaClass = 'ukukhula',
    bbdClass = 'bbd-bursar',
    adminClass = 'admin-theme',
    ukukhulaIconPath = "../assets/icon.png",
    bbdIconPath = "../assets/bbd-icon.svg",
    bbdTitle = "BBD bursary programme",
    adminTitle = "BBD bursaries"
}

export function theming(applicationUrl: string): void {
    const component = document.querySelector("html");

    if(applicationUrl && (typeof applicationUrl === 'string')) {
      if(bbdBursarUrl(applicationUrl)) {
        updateIconAndTitle(applicationUrl, Themes.bbdIconPath);
        if(component) component?.classList.add(Themes.bbdClass); 
      } else if (adminUrl(applicationUrl)) { 
        updateIconAndTitle(applicationUrl, Themes.bbdIconPath);
        if(component) component?.classList.add(Themes.adminClass); 
      } else {
        updateIconAndTitle(applicationUrl, Themes.ukukhulaIconPath);
        if(component) component?.classList.add(Themes.ukukhulaClass);
      }
    }
  }

export function bbdBursarUrl(applicationUrl: string): boolean {
  return applicationUrl.includes(Themes.bbd);
}

export function adminUrl(applicationUrl: string): boolean {
  return applicationUrl.includes(Themes.admin);
}

export function getElements(): { title: HTMLElement | null; icon: HTMLElement | null } {
  return {
    title: document.querySelector("title") ? document.querySelector("title") : null,
    icon: document.querySelector(".site-icon") ? document.querySelector(".site-icon") : null,
  }
}

export function updateIconAndTitle(applicationUrl: string, iconPath: string): void {
  const elements = getElements();
  if (elements.title) {
    if (bbdBursarUrl(applicationUrl)) {
      elements.title.innerText = Themes.bbdTitle;
    } else if (adminUrl(applicationUrl)) {
      elements.title.innerText = Themes.adminTitle;
    }
  }

  if (elements.icon) elements.icon.setAttribute("href", iconPath);
}