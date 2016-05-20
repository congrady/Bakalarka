AppConfig.beforePageShow = [
  //function(){ console.log('beforePageShow') }
];
AppConfig.afterPageShow = [
  //function(){ console.log('afterPageShow'); }
];
AppConfig.beforePageDetach = [
  //function(){ console.log('beforePageDetach'); }
];
AppConfig.onAppInit = [
  function(){
    App.userName = sessionStorage.getItem('userName');
    App.token = sessionStorage.getItem('token');
    App.authLevel = sessionStorage.getItem('authLevel');  
  }
];
