FrameworkConfig = {
  routes: [
    {path: "/", page: 'Home', navigation: false, auth: false, resources: []},
    {path: "/Home", page: 'Home', navigation: true, auth: false, resources: []},
    {path: "/Page1", page: 'Page1', navigation: true, auth: false, resources: []},
    {path: "/Page2", page: 'Page2', navigation: true, auth: true, resources: []}
  ]
};
