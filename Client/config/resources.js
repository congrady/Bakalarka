AppConfig.globalDependencies = [
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react-dom.min.js'
  }, 
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react.min.js'
  }
]

AppConfig.templates = {
  'Home': {
    url: '/pages/Home/Home.html'
  },
  'Contact': {
    url: '/pages/Contact/Contact.html'
  },
  'NewTest': {
    url: '/pages/NewTest/NewTest.html'
  },
  'NewSegment': {
    url: '/pages/NewSegment/NewSegment.html'
  },
  'default-layout': {
    url: '/pages/_DefaultLayout/default-layout.html'
  }
}

AppConfig.components = {
  'test-component': {
    type: 'web-component',
    url: '/web-components/test-component.js'
  },
  'main-navigation': {
    type: 'web-component',
    url: '/web-components/main-navigation.js'
  },
  'main-login': {
    type: 'web-component',
    url: '/web-components/main-login.js'
  },
  'Hello': {
    type: 'react',
    url: '/react-components/hello.js'
  }
}

AppConfig.scripts = {
  'jQuery': {
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'
  }
}