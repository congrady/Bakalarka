'use strict';

class ResourceLoader {
	constructor() {
		this.unresolvedResourcesCounter = 0;
		this.urlPrefix = AppConfig.mode == 'dev' ? AppConfig.devModeUrlPrefix : AppConfig.prodModeUrlPrefix;
	}

	saveData(dataName, response) {
		if (AppConfig.data[dataName].type == 'json' && AppConfig.data[dataName].key) {
			let key = AppConfig.data[dataName].key;
			App.dataStore.data[dataName] = {};
			let dataResponse = JSON.parse(response);
			for (let obj of dataResponse) {
				App.dataStore.data[dataName][obj[key]] = obj;
			}
		} else if (AppConfig.data[dataName].type == 'json') {
			App.dataStore.data[dataName] = JSON.parse(response);
		} else {
			App.dataStore.data[dataName] = response;
		}
	}

	handleNonBlockingData(dataName, response) {
		console.log(dataName);
		this.saveData(dataName, response);
		let index = App.dataStore.actionPool.length;
		while (index--) {
			let dataPoolEntry = App.dataStore.actionPool[index];
			if (dataPoolEntry.dataName == message.data.name) {
				if (message.data.response) {
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

	loadData(neededData, auth) {
		for (let data of neededData) {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', data.url, true);
			let self = this;
			xhr.onload = function (response) {
				if (xhr.status == 200) {
					self.handleNonBlockingData(data.name, response.response);
				} else if (xhr.status == 400) {
					App.router.showError();
				} else if (xhr.status == 401) {
					App.router.showError('unauthorized');
				}
			};
			xhr.onerror = function () {
				App.router.showError('timeout');
			}
			if (auth) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + App.token);
			}
			xhr.send();
		}
	}

	handleError(type) {
		App.router.showError(type);
		this.unresolvedResourcesCounter = -1;
	}

	loadTemplate(url, templateName) {
		this.sendRequest(url, function (response) {
			App.router.htmlTemplates.set(templateName, response);
		})
	}

	loadReactComponent(url, componentName) {
		this.sendRequest(url, function (response) {
			window[componentName] = React.createFactory(eval(response));
		})
	}

	loadScript(url) {
		this.sendRequest(url, function (response) {
			let head = document.getElementsByTagName('head')[0];
			let script = document.createElement('script');
			script.innerHTML = response;
			head.appendChild(script);
		})
	}

	loadBlockingData(url, dataName) {
		var self = this;
		this.sendRequest(url, function (response) {
			self.saveData(dataName, response)
		})
	}
	
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
