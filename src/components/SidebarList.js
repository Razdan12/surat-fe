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
    label: "Persuratan",
    path: "",
    icon: "GoTasklist",
    subLabel: [
      {
        label: "Surat Masuk",
        path: "/surat-masuk",
        permission: [],
      },
      {
        label: "Surat Keluar",
        path: "/surat-keluar",
        permission: [],
      },
    ],
    permission: [],
  },

  {
    label: "Disposisi",
    path: "/disposisi-surat-masuk",
    icon: "GoTasklist",
    subLabel: [],
    permission: [],
  },
  {
    label: "Laporan",
    path: "/laporan-surat",
    icon: "GoTasklist",
    subLabel: [],
    permission: [],
  },
];
