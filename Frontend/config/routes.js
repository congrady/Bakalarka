AppConfig.routes = [
  {page: 'Home', path: ["/","/Home"], navigation: "Home", resources: ["Home", "ExampleApplication"]},
  {page: 'NewTest', path: "/NewTest", navigation: "New test", auth: 0, resources: ["NewTest"]},
  {page: 'NewSegment', path: "/NewSegment", navigation: "New segment", auth: 0, resources: ["NewSegment"], data: {TestName: "all"}},
  {page: 'Tests', path: "/Tests", navigation: "Tests", auth: 1, resources: ["test-component"], data: {TestData: "all"}},
  {page: 'Contact', path: "/Contact", navigation: "Contact", resources: ["Contact"]},
  {page: 'Test', path: "/Test", auth: 1, data: {TestData: "specific"}}
]
