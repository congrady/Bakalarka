AppConfig = {
  title: "UX | ",
  resources: [
    {name: "jQuery", path: "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"},
    {name: "test-component", path: "/Frontend/components/test-component.js"},
    {name: "Home", path: "/Frontend/templates/Home.html"},
    {name: "Contact", path: "/Frontend/templates/Contact.html"},
    {name: "NewTest", path: "/Frontend/templates/NewTest.html"}
  ],
  routes: [
    {page: 'Home', path: ["/Home","/"], navigation: "Home", resources: ["Home"]},
    {page: 'NewTest', path: "/NewTest", navigation: "New test", auth: true, resources: ["NewTest"]},
    {page: 'Tests', path: "/Tests", navigation: "Tests", auth: true, resources: ["test-component"]},
    {page: 'Contact', path: "/Contact", navigation: "Contact", resources: ["Contact"]},
    {page: 'Test', path: "/Test", auth: true}
  ],
};
