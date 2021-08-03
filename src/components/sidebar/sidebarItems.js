export const items = [
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/",
    Icons: "home",
  },
  {
    name: "manageProject",
    label: "Manage Project",
    path: "/manageProject",
    Icons: "cog",
  },
  {
    name: "projectFeatures",
    label: "Project Features",
    path: "/projectFeatures",
    Icons: "sliders-h",
    items: [
      {
        name: "createTicket",
        label: "Create Ticket",
        path: "/createTicket",
      },
      {
        name: "addItems",
        label: "Add Items",
        path: "/addItems",
      },
      {
        name: "createPointOfSale",
        label: "Create Point of Sale",
        path: "/POS/createPOS",
      },
    ],
  },
  {
    name: "finance",
    label: "Finance",
    Icons: "chart-area",
    items: [
      {
        name: "orders",
        label: "Orders",
        path: "/finance/orders",
      },
      {
        name: "revenue",
        label: "Revenue",
        path: "/finance/revenue",
      },
      // {
      //   name: "VAT",
      //   label: "VAT",
      //   path: "/finance/taxes",
      // },
      {
        name: "billingCenter",
        label: "Billing Center",
        path: "/finance/billingCenter",
      },
    ],
  },
];
