'use strict';

class DataStore {
  constructor(){
    this.dataChanges = {};
    this.dataKeys = {};
    this.unresolovedDataChangesCounter = {};
    for (let dataName in AppConfig.data){
      if (AppConfig.data[dataName].key){
        this.dataKeys[dataName] = AppConfig.data[dataName].key;
      }
    }
    this.data = {};
    this.actionPool = [];
  }

  dataHandler(params) {
    if (params.specific && App.dataStore.data[params.dataName] && App.dataStore.data[params.dataName][params.specific]){
      params.action(App.dataStore.data[params.dataName][params.specific]);
    } else {
      App.dataStore.actionPool.push(params);
    }
  }

  fillForm(params){
    let formData = new FormData();
    formData.append("table", AppConfig.data[params.dataName].table);
    if (params.key){
      formData.append("where", `${this.dataKeys[params.dataName]}=${params.key}`);
    }
    if (params.data){
      let colString = "";
      for (let col in params.data){
        colString += (col + "=" + params.data[col]+",");
      }
      colString = colString.slice(0, -1);
      formData.append("columns", colString);
    }
    return formData
  }

  deleteData(params){
    let requestParams = {};
    requestParams.method = "DELETE";
    requestParams.url = AppConfig.deleteURL;
    requestParams.formData = App.dataStore.fillForm({
      key: params.key,
      dataName: params.dataName
    });
    if (params.success){
      requestParams.success = function(response) {
        params.success(response);
        App.dataStore.deleteClientData({
          dataName: params.dataName,
          key: params.key
        })
      }
    } else {
      requestParams.success = function(response) {
        App.dataStore.deleteClientData({
          dataName: params.dataName,
          key: params.key
        })
      }
    }
    if (params.error){
      requestParams.error = params.error;
    }
    this.ajaxREST(requestParams)
  }

  updateData(params){
    let requestParams = {};
    requestParams.method = "POST";
    requestParams.url = AppConfig.updateURL;
    requestParams.formData = App.dataStore.fillForm({
      key: params.key,
      data: params.data,
      dataName: params.dataName
    });
    if (params.success){
      requestParams.success = function(response) {
        params.success(response);
        App.dataStore.updateClientData({
          dataName: params.dataName,
          key: params.key,
          data: JSON.parse(response)
        })
      }
    } else {
      requestParams.success = function(response) {
        App.dataStore.updateClientData({
          dataName: params.dataName,
          key: params.key,
          data: JSON.parse(response)
        })
      }
    }
    if (params.error){
      requestParams.error = params.error;
    }
    this.ajaxREST(requestParams)
  }

  putData(params){
    let requestParams = {};
    requestParams.method = "PUT";
    requestParams.url = AppConfig.putURL;
    requestParams.formData = this.fillForm({
      data: params.data,
      dataName: params.dataName
    })
    if (params.success){
      requestParams.success = function(response){
        params.success(response);
        App.dataStore.putClientData({
          dataName: params.dataName,
          data: params.data
        })
      }
    } else {
      requestParams.success = function(response){
        App.dataStore.putClientData({
          dataName: params.dataName,
          data: params.data
        })
      }
    }
    if (params.error){
      requestParams.error = params.error;
    }
    this.ajaxREST(requestParams)
  }

  enqueueDataChange(params){
    let key = params.key ? params.key : params.data[App.dataStore.dataKeys[params.dataName]];
    for (let dataName in this.dataChanges){
      if (params.dataName == dataName && this.dataChanges[params.dataName][key]){
        let dataChange = this.dataChanges[dataName];
        if (params.action == 'DELETE'){
          delete this.dataChanges[params.dataName][key];
          return
        } else if (params.action == 'UPDATE'){
          if (dataChange.action == 'DELETE'){
            delete this.dataChanges[params.dataName][key];
          } else if (dataChange.action == 'PUT' || dataChange.action == 'UPDATE'){
            for (let prop in params.data){
              this.dataChanges[params.dataName][key][data][prop] = params.data[prop];
            }
            return
          }
        } else if (params.action == 'PUT'){
          delete this.dataChanges[params.dataName][key];
        }
      }
    }
    if (!this.dataChanges[params.dataName]){
      this.dataChanges[params.dataName] = {};
    }
    this.dataChanges[params.dataName][key] = {
      action: params.action,
      data: params.data ? params.data : 'undefined'
    }
  }

  deleteClientData(params){
    delete this.data[params.dataName][params.key];
  }

  updateClientData(params){
    let key = params.key;
    for (let propName in params.data){
      if (propName == this.dataKeys[params.dataName]){
        alert(params.data[propName])
        key = params.data[propName];
        this.data[params.dataName][key] = this.data[params.dataName][params.key];
        this.data[params.dataName][key][propName] = params.data[propName];
        delete this.data[params.dataName][params.key];
      }
    }
  }

  putClientData(params) {
    if (!App.dataStore.data[params.dataName]){
      App.dataStore.data[params.dataName] = {};
    }
    App.dataStore.data[params.dataName][params.data[AppConfig.data[params.dataName].key]] = params.data;
  }

  ajaxREST(params){
    let xhr = new XMLHttpRequest();
    xhr.open(params.method, params.url, true);
    xhr.onload = function() {
      if (xhr.status == 200) {
        if (params.success){
          params.success(xhr.response);
        }
      } else {
        if (params.error){
          params.error(xhr.response);
        }
      }
    }
    if (App.token){
      xhr.setRequestHeader('Authorization', 'Bearer ' + App.token);
    }
    if (params.timeout){
      if (params.error){
        params.error(xhr.response);
      }
    }
    xhr.send(params.formData);
  }

  syncData(params){
    if (!this.dataChanges[params.dataName]){
      return
    }
    this.unresolovedDataChangesCounter[params.dataName] = Object.keys(this.dataChanges[params.dataName]).length;
    for (let dataChangeKey in this.dataChanges[params.dataName]){
      let dataChange = this.dataChanges[params.dataName][dataChangeKey];
      dataChange.dataName = params.dataName;
      dataChange.key = dataChangeKey;
      let requestParams = {};
      requestParams.formData = this.fillForm(dataChange);
      requestParams.method == params.action;
      if (dataChange.action == 'UPDATE') {
        requestParams.url = AppConfig.updateURL;
      } else if (dataChange.action == 'PUT'){
        requestParams.url = AppConfig.putURL;
      } else if (dataChange.action == 'DELETE'){
        requestParams.url = AppConfig.deleteURL;
      }
      if (params.error){
        requestParams.error = function(response){
          params.error(response)
          App.dataStore.unresolovedDataChangesCounter[params.dataName] = -1;
        }
      } else {
        requestParams.error = function(response){
          App.dataStore.unresolovedDataChangesCounter[params.dataName] = -1;
        }
      }
      if (params.success){
        requestParams.success = function(response){
          delete App.dataStore.dataChanges[params.dataName][dataChangeKey];
          App.dataStore.unresolovedDataChangesCounter[params.dataName]--;
          if (App.dataStore.unresolovedDataChangesCounter[params.dataName] == 0){
            params.success(response);
          }
        }
      } else {
        requestParams.success = function(response){
          delete App.dataStore.dataChanges[params.dataName][dataChangeKey];
          App.dataStore.unresolovedDataChangesCounter[params.dataName]--;
        }
      }
      this.ajaxREST(requestParams);
    }
  }
}
