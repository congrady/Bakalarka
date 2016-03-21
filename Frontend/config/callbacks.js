AppConfig.callbacks = {
  beforePageShow: [
    function(params){ document.getElementsByTagName("main-navigation")[0].setAttribute("active", params.page); }
  ],
  afterPageShow: [
    //function(params){ console.log("afterPageShow"); }
  ],
  beforePageDetach: [
    //function(params){ console.log("beforePageDetach"); }
  ],
  onAppInit: [
    //function(){ console.log("onAppInit"); }
  ]
}
