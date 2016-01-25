FrameworkConfig = {
  title: "UX | ",
  routes: [
    {path: "/", page: 'Home', navigation: false, auth: false, resources: [], template: false},
    {path: "/Home", page: 'Home', navigation: true, auth: false, resources: [], template: false},
    {path: "/Page1", page: 'Page1', navigation: true, auth: false, resources: [], template: false},
    {path: "/Page2", page: 'Page2', navigation: true, auth: true, resources: [], template: false},
    {path: "/Page3", page: 'Page3', navigation: true, auth: false, resources: [], template: false},
    {path: "/Kontakt", page: 'Kontakt', navigation: true, auth: false, resources: [], template: true}
  ],
};
