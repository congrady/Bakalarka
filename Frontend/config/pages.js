AppConfig.pages = {
  'Home': {
    path: ["/Home","/"],
    title: 'Home',
    navigation: "Home",
    resources: ["Home"]
  },
  'NewTest' : {
    path: "/NewTest",
    title: 'NewTest',
    resources: ["NewTest"],
    auth: 0
  },
  'NewSegment' : {
    path: "/NewSegment",
    title: 'NewSegment',
    navigation: "New segment",
    resources: ["NewSegment"],
    data: {TestName: "all"},
    auth: 0
  },
  'Tests' : {
    path: "/Tests",
    title: 'Tests',
    navigation: "Tests",
    resources: ["test-component"],
    data: {TestData: "all"},
    auth: 1
  },
  'Contact' : {
    path: "/Contact",
    title: 'Contact',
    navigation: "Contact",
    resources: ["Contact"]
  },
  'Test' : {
    path: "/Test",
    title: 'Test',
    data: {TestData: "specific"},
    auth: 1
  }
}
