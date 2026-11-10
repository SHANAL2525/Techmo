export interface NavItem {
  id: string;
  label: string;
  href: string;
  sceneIndex: number;
}

export const primaryNavItems: NavItem[] = [
  {
    id: "discover",
    label: "Discover",
    href: "#discover",
    sceneIndex: 1,
  },
  {
    id: "our-expertise",
    label: "Our Expertise",
    href: "#our-expertise",
    sceneIndex: 3,
  },
  {
    id: "how-we-build",
    label: "How We Build",
    href: "#how-we-build",
    sceneIndex: 4,
  },
  {
    id: "our-work",
    label: "Our Work",
    href: "#our-work",
    sceneIndex: 5,
  },
  {
    id: "start-a-project",
    label: "Start a Project",
    href: "#start-a-project",
    sceneIndex: 6,
  },
];

export const footerQuickLinks: NavItem[] = primaryNavItems;
