AppConfig.layouts = {
  'default': {
    url: '/Client/pages/_DefaultLayout/default-layout.js',
    template: ['default-layout'],
    components: ['main-navigation', 'main-login']
  }
}

AppConfig.pages = {
  'Home': {
    url: '/Client/pages/Home/Home.js',
    path: ['/', '/Home/:id/:igor'],
    title: 'Home',
    template: ['Home']
  },
  'NewTest' : {
    url: '/Client/pages/NewTest/NewTest.js',
    path: '/NewTest',
    title: 'NewTest',
    template: ['NewTest'],
    auth: 0
  },
  'NewSegment' : {
    url: '/Client/pages/NewSegment/NewSegment.js',
    path: '/NewSegment/:testId',
    title: 'New Segment',
    template: ['NewSegment'],
    data: {TestName: 'all'},
    auth: 0
  },
  'Tests' : {
    url: '/Client/pages/Tests/Tests.js',
    path: '/Tests',
    title: 'Tests',
    components: ['test-component'],
    data: {TestData: 'all'},
    auth: 1
  },
  'Contact' : {
    url: '/Client/pages/Contact/Contact.js',
    path: '/Contact',
    title: 'Contact',
    template: ['Contact']
  },
  'Test' : {
    url: '/Client/pages/Test/Test.js',
    path: '/Test',
    title: 'Test',
    data: {TestData: 'specific'},
    auth: 1
  }
}
