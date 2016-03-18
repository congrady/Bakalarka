AppConfig.dataModels = {
  TestData: {
    get: "/GET/tests$name,added_by,uploaded,last_modified$name={}$$",
    getAll: "/GET/tests$name,added_by,uploaded,last_modified$$$",
    key: "name",
    table: "tests",
    keyIndex: 0
  },
  TestsData: {
    get: "/GET/tests$name,added_by,uploaded,last_modified$$$"
  },
  TestName : {
    getAll: "/GET/tests$name"
  }
}
