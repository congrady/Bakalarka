'use strict';

class ResourceLoader {
	constructor() {
		this.unresolvedResourcesCounter = 0;
		this.urlPrefix = AppConfig.mode == 'dev' ? AppConfig.devModeUrlPrefix : AppConfig.prodModeUrlPrefix;
	}
	
	// saves data to data store
	saveData(dataName, response) {
		if (AppConfig.data[dataName].type == 'json' && AppConfig.data[dataName].key) {
			let key = AppConfig.data[dataName].key;
			App.dataStore.data[dataName] = {};
			let dataResponse = JSON.parse(response);
			for (let obj of dataResponse) {
				App.dataStore.data[dataName][obj[key]] = obj;
			}
		} else if (AppConfig.data[dataName].type == 'json' && response) {
			App.dataStore.data[dataName] = JSON.parse(response);
		} else if (response){
			App.dataStore.data[dataName] = response;
		}
	}
	
	// handles non blocking data, doing specified action on them
	handleNonBlockingData(dataName, response) {
		this.saveData(dataName, response);
		let index = App.dataStore.actionPool.length;
		while (index--) {
			let dataPoolEntry = App.dataStore.actionPool[index];
			if (dataPoolEntry.dataName == dataName) {
				if (response) {
					if (dataPoolEntry.specific) {
						dataPoolEntry.action(App.dataStore.data[dataPoolEntry.dataName][dataPoolEntry.specific]);
					} else {
						dataPoolEntry.action(App.dataStore.data[dataPoolEntry.dataName]);
					}
				}
				App.dataStore.actionPool.splice(index, 1);
			}
		}
	}
	
	// loads non blocking data
	loadData(neededData, auth) {
		var self = this;
		for (let data of neededData) {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', data.url, true);
			let self = this;
			xhr.onload = function (response) {
				if (self.unresolvedResourcesCounter == -1){
					return
				}
				if (xhr.status == 200) {
					self.handleNonBlockingData(data.name, xhr.response);
				} else if (xhr.status == 400) {
					self.handleError();
				} else if (xhr.status == 401) {
					self.handleError('unauthorized');
				} else {
					self.handleError();
				}
			};
			xhr.onerror = function () {
				self.handleError('timeout');
			}
			if (auth) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + App.token);
			}
			xhr.send();
		}
	}
	
	// handles error loading resources
	handleError(type) {
		App.router.showError(type);
		this.unresolvedResourcesCounter = -1;
	}
	
	// loads template
	loadTemplate(url, templateName) {
		this.sendRequest(url, function (response) {
			App.router.htmlTemplates.set(templateName, response);
		})
	}
	
	// loads react component
	loadReactComponent(url, componentName) {
		this.sendRequest(url, function (response) {
			window[componentName] = React.createFactory(eval(response));
		})
	}
	
	// loads script
	loadScript(url) {
		this.sendRequest(url, function (response) {
			let head = document.getElementsByTagName('head')[0];
			let script = document.createElement('script');
			script.innerHTML = response;
			head.appendChild(script);
		})
	}
	
	// loads blocking data
	loadBlockingData(url, dataName) {
		var self = this;
		this.sendRequest(url, function (response) {
			self.saveData(dataName, response)
		})
	}
	
	// loads global dependency
	loadGlobalDependency({url, wrap}){
		var self = this;
		// Todo: Load it as AMD or CommonJS
		this.sendRequest(url, function (response) {
			let head = document.getElementsByTagName('head')[0];
			let script = document.createElement('script');
			script.innerHTML = response;
			head.appendChild(script);
		})
	}
	
	// XHR for resource request
	sendRequest(url, resourceSpecificCallBack) {
		if (this.unresolvedResourcesCounter == -1) {
			return
		}
		url = url.startsWith('https://') ? url : this.urlPrefix + url;
		var self = this;
		xhr_get({
			url: url,
			token: self.auth ? App.token : false,
			success: function (response) {
				if (self.unresolvedResourcesCounter == -1) {
					return
				}
				resourceSpecificCallBack(response);
				self.unresolvedResourcesCounter -= 1;
				if (self.unresolvedResourcesCounter == 0) {
					self.success();
				}
			},
			unauthorized: function () {
				self.handleError('unauthorized');
			},
			timeout: function () {
				self.handleError('timeout');
			},
			badRequest: function() {
				self.handleError();
			}
		});
	}
	
	
	// Starts loading of resources using their respective handlers
	loadResources(neededResources, auth, success) {
		this.unresolvedResourcesCounter = neededResources.length;
		this.auth = auth;
		this.success = success;
		for (let resource of neededResources) {
			if (resource.type == 'script' || resource.type == 'web-component') {
				this.loadScript(resource.url)
			} else if (resource.type == 'template') {
				this.loadTemplate(resource.url, resource.name);
			} else if (resource.type == 'react-component') {
				this.loadReactComponent(resource.url, resource.componentName);
			} else if (resource.type == 'global-dependency') {
				this.loadGlobalDependency(resource);
			} else {
				this.loadBlockingData(resource.url, resource.name);
			}
		}
	}
}
