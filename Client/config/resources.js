AppConfig.globalDependencies = [
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react-dom.min.js'
  }, 
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react.min.js',
    wrap: 'igor'
  }
]

AppConfig.templates = {
  'Home': {
    url: '/Client/pages/Home/Home.html'
  },
  'Contact': {
    url: '/Client/pages/Contact/Contact.html'
  },
  'NewTest': {
    url: '/Client/pages/NewTest/NewTest.html'
  },
  'NewSegment': {
    url: '/Client/pages/NewSegment/NewSegment.html'
  },
  'default-layout': {
    url: '/Client/pages/_DefaultLayout/default-layout.html'
  }
}

AppConfig.components = {
  'test-component': {
    type: 'web-component',
    url: '/Client/web-components/test-component.js'
  },
  'main-navigation': {
    type: 'web-component',
    url: '/Client/web-components/main-navigation.js'
  },
  'main-login': {
    type: 'web-component',
    url: '/Client/web-components/main-login.js'
  },
  'Hello': {
    type: 'react',
    url: '/Client/react-components/hello.js'
  }
}

AppConfig.scripts = {
  'jQuery': {
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'
  }
}