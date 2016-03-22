AppConfig.pages = {
  'Home': {
    path: ["/Home","/"],
    navigation: "Home",
    resources: ["Home", "Hello"]
  },
  'NewTest' : {
    path: "/NewTest",
    navigation: "New test",
    resources: ["NewTest"],
    auth: 0
  },
  'NewSegment' : {
    path: "/NewSegment",
    navigation: "New segment",
    resources: ["NewSegment"],
    data: {TestName: "all"},
    auth: 0
  },
  'Tests' : {
    path: "/Tests",
    navigation: "Tests",
    resources: ["test-component"],
    data: {TestData: "all"},
    auth: 1
  },
  'Contact' : {
    path: "/Contact",
    navigation: "Contact",
    resources: ["Contact"]
  },
  'Test' : {
    path: "/Test",
    data: {TestData: "specific"},
    auth: 1
  }
}
