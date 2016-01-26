FrameworkConfig = {
  title: "UX | ",
  resources: [
    //{name: "jQuery", path: "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"},
    {name: "test-component", path: "/Frontend/components/test-component.js"}
  ],
  routes: [
    {path: "/", page: 'Home', navigation: false, auth: false, resources: [], template: true},
    {path: "/Home", page: 'Home', navigation: true, auth: false, resources: [], template: true},
    {path: "/newTest", page: 'newTest', navigation: true, auth: true, resources: [], template: false},
    {path: "/Tests", page: 'Tests', navigation: true, auth: true, resources: ["test-component"], template: false},
    {path: "/Kontakt", page: 'Kontakt', navigation: true, auth: false, resources: [], template: true}
  ],
};
