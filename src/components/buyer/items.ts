import {
  BarChart,
  Building,
  DollarSign,
  FileText,
  Heart,
  Home,
  Key,
  Map,
  MessageSquareIcon,
  Settings,
  Star,
  User,
  Users,
} from "lucide-react";

export const discoverItems = [
  {
    icon: Building,
    label: "All Properties",
    href: "/properties",
  },
  {
    icon: Star,
    label: "Featured",
    href: "/properties/featured",
  },
  // {
  //     icon: Map,
  //     label: "Map View",
  //     href: "/properties/map-view"
  // },
  {
    icon: Heart,
    label: "Saved Properties",
    href: "/properties/saved",
  },
];
export const transactionItems = [
  {
    icon: DollarSign,
    label: "Buy",
    href: "/properties/buy",
  },
  {
    icon: Key,
    label: "Rent",
    href: "/properties/rent",
  },
  {
    icon: FileText,
    label: "Lease",
    href: "/properties/lease",
  },
];
export const resourceItems = [
  {
    icon: User,
    label: "My Profile",
    href: "/profile",
  },
  {
    icon: Users,
    label: "Find Agents",
    href: "/properties/agents",
  },
  {
    icon: FileText,
    label: "Deal Proposals",
    href: "/proposals",
  },
  {
    icon: MessageSquareIcon,
    label: "Messages",
    href: "/messages",
  },
];
