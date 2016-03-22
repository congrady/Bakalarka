AppConfig.data = {
  'TestData': {
    useDefaultGetURL: true, // if set, adds AppConfig.getURL suffix to get request
    get: "tests$name,added_by,uploaded,last_modified$name={}$$", // url to get specific TestData object
    getAll: "tests$name,added_by,uploaded,last_modified$$$", // url to get all TestData objects
    type: 'json', // if set to JSON, response will be JSON-parsed before saved
    key: "name", // data property that should be considered as unique identifier
    keyIndex: 0, //index of URL parameter that will replace {} in get request
    //blocking: true // if set, page wont start rendering until data are loaded
  },
  'TestName' : {
    getAll: '/GET/tests$name',
    type: 'json'
  }
}
