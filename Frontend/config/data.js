AppConfig.data = {
  'TestData': {
    table: 'tests',
    get: "/GET/tests$name,added_by,uploaded,last_modified$name={}$$", // url to get specific TestData object
    getAll: "/GET/tests$name,added_by,uploaded,last_modified$$$", // url to get all TestData objects
    type: 'json', // if set to JSON, response will be JSON-parsed before saved
    key: "name", // data property that should be considered as unique identifier
    //keyIndex: 0, //index of URL parameter that will replace {} in get request, default: 0
    //blocking: true // if set, page wont start rendering until this data are loaded
  },
  'TestName' : {
    getAll: '/GET/tests$name',
    type: 'json'
  },
  'SegmentsCount' : {
    get: '/SegmentsCount/${}',
    getAll: '/SegmentsCount/',
    type: 'json',
    key: 'name'
  }
}
