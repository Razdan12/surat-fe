export const sidebarList = [
  {
    label: "Dashboard",
    path: "/",
    icon: "BsFillHouseFill",
    subLabel: [],
  },
  {
    label: "Users Management",
    path: "/users",
    icon: "IoPersonSharp",
    subLabel: [],
    permission: [],
  },
  {
    label: "Letter Management",
    path: "",
    icon: "GoTasklist",
    subLabel: [
      {
        label: "Incoming Letters",
        path: "/surat-masuk",
        permission: [],
      },
      {
        label: "Outcoming Letters",
        path: "/surat-keluar",
        permission: [],
      },
    ],
    permission: [],
  },

  {
    label: "Disposition List",
    path: "/disposisi-surat-masuk",
    icon: "GoTasklist",
    subLabel: [],
    permission: [],
  },
  {
    label: "Report",
    path: "/disposisi-surat-masuk",
    icon: "GoTasklist",
    subLabel: [],
    permission: [],
  },
];
