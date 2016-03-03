AppConfig = {
  title: "UX | ",
  loginPath: "/Login",
  resources: [
    {name: "jQuery", path: "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"},
    {name: "test-component", path: "/Frontend/components/test-component.js"},
    {name: "Home", path: "/Frontend/templates/Home.html"},
    {name: "Contact", path: "/Frontend/templates/Contact.html"},
    {name: "NewTest", path: "/Frontend/templates/NewTest.html"},
    {name: "NewSegment", path: "/Frontend/templates/NewSegment.html"}
  ],
  data: [
    {
      name: "TestData",
      table: "tests",
      columns:["name","added_by","uploaded_string","last_modified_string"],
      conditions: ["name={}"]
    },
    {name: "TestsInfo", url: "/GetTestsInfo"}
  ],
  routes: [
    {page: 'Home', path: ["/Home","/"], navigation: "Home", resources: ["Home"]},
    {page: 'NewTest', path: "/NewTest", navigation: "New test", auth: 0, resources: ["NewTest"]},
    {page: 'NewSegment', path: "/NewSegment", navigation: "New segment", auth: 0, resources: ["NewSegment"]},
    {page: 'Tests', path: "/Tests", navigation: "Tests", auth: 1, resources: ["test-component"], data: ["TestsInfo"]},
    {page: 'Contact', path: "/Contact", navigation: "Contact", resources: ["Contact"]},
    {page: 'Test', path: "/Test", auth: 1, data: ["TestData"]}
  ],
  beforePageShow: [
    function(params){ document.getElementsByTagName("main-navigation")[0].setAttribute("active", params.page);}
  ],
  afterPageShow: [

  ]
};
