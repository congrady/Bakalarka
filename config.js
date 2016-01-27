FrameworkConfig = {
  title: "UX | ",
  resources: [
    //{name: "jQuery", path: "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"},
    {name: "test-component", path: "/Frontend/components/test-component.js"}
  ],
  routes: [
    {path: "/", page: 'Home', navigation: false, auth: false, resources: [], template: true},
    {path: "/Home", page: 'Home', navigation: "Home", auth: false, resources: [], template: true},
    {path: "/NewTest", page: 'NewTest', navigation: "New test", auth: true, resources: [], template: false},
    {path: "/Tests", page: 'Tests', navigation: "Tests", auth: true, resources: ["test-component"], template: false},
    {path: "/Contact", page: 'Contact', navigation: "Contact", auth: false, resources: [], template: true},
    {path: "/Test", page: "Test", navigation: false, auth: true, resources: [], template: false}
  ],
};
