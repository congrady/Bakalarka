AppConfig.layouts = {
  'default': {
    url: '/pages/_DefaultLayout/default-layout.js',
    template: ['default-layout'],
    components: ['main-navigation', 'main-login']
  }
}

AppConfig.pages = {
  'Home': {
    url: '/pages/Home/Home.js',
    path: ['/', '/Home'],
    title: 'Home',
    template: ['Home']
  },
  'NewTest' : {
    url: '/pages/NewTest/NewTest.js',
    path: '/NewTest',
    title: 'NewTest',
    template: ['NewTest'],
    auth: 0
  },
  'NewSegment' : {
    url: '/pages/NewSegment/NewSegment.js',
    path: '/NewSegment/:testId',
    title: 'New Segment',
    template: ['NewSegment'],
    data: {TestName: 'all'},
    auth: 0
  },
  'Tests' : {
    url: '/pages/Tests/Tests.js',
    path: '/Tests',
    title: 'Tests',
    components: ['test-component'],
    data: {TestData: 'all'},
    auth: 1
  },
  'Contact' : {
    url: '/pages/Contact/Contact.js',
    path: '/Contact',
    title: 'Contact',
    template: ['Contact']
  },
  'Test' : {
    url: '/pages/Test/Test.js',
    path: '/Test/:id',
    title: 'Test',
    data: {TestData: 'specific'},
    auth: 1
  }
}
