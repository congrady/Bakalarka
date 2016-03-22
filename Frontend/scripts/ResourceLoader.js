'use strict';

class ResourceLoader {
	constructor(){
		this.unresolvedResourcesCounter = 0;
		this.worker = new Worker("/Frontend/scripts/ResourceLoaderWorker.js");
	}

	saveData(dataName, response){
		if (AppConfig.data[dataName].type == 'json' && AppConfig.data[dataName].key){
			let key = AppConfig.data[dataName].key;
			App.data[dataName] = {};
			let dataResponse = JSON.parse(response)
			for (let obj of dataResponse){
				App.data[dataName][obj[key]] = obj;
			}
		} else if (AppConfig.data[dataName].type == 'json'){
			App.data[dataName] = JSON.parse(response);
		} else {
			App.data[dataName] = response;
		}
	}

	loadData(neededData, auth) {
		var self = this;
		this.worker.addEventListener("message", function(message) {
			self.saveData(message.data.name, message.data.response);
			let index = App.actionPool.length;
			while (index--) {
				let dataPoolEntry = App.actionPool[index];
				if (dataPoolEntry.dataName == message.data.name){
					if (dataPoolEntry.specific){
						dataPoolEntry.action(App.data[dataPoolEntry.dataName][dataPoolEntry.specific]);
					} else {
						dataPoolEntry.action(App.data[dataPoolEntry.dataName]);
					}
					App.actionPool.splice(index, 1);
				}
			}
		});

		for (let data of neededData) {
			if (auth) {
				this.worker.postMessage({
					"name": data.name,
					url: data.url,
					token: App.token
				});
			} else {
				this.worker.postMessage({
					"name": data.name,
					url: data.url
				});
			}
		}
	}

	handleError(type) {
		App.router.showError(type);
		this.unresolvedResourcesCounter = -1;
	}

	loadTemplate(url, templateName) {
		this.sendRequest(url, function(response){
			App.htmlTemplates.set(templateName, response);
		})
	}

	loadReactComponent(url, componentName) {
		this.sendRequest(url, function(response){
			window[componentName] = React.createFactory(eval(response));
		})
	}

	loadReactComponent(url, componentName) {
		this.sendRequest(url, function(response){
			window[componentName] = React.createFactory(eval(response));
		})
	}

	loadScript(url) {
		this.sendRequest(url, function(response){
			let head = document.getElementsByTagName('head')[0];
			let script = document.createElement('script');
			script.innerHTML = response;
			head.appendChild(script);
		})
	}

	loadBlockingData(url, dataName) {
		var self = this;
		this.sendRequest(url, function(response){
			self.saveData(dataName, response)
		})
	}

	sendRequest(url, resourceSpecificCallBack){
		if (this.unresolvedResourcesCounter == -1) {
			return
		}
		var self = this;
		xhr_get({
			url: url,
			token: self.auth ? App.token : false,
			success: function(response) {
				if (self.unresolvedResourcesCounter == -1) {
					return
				}
				resourceSpecificCallBack(response);
				self.unresolvedResourcesCounter -= 1;
				if (self.unresolvedResourcesCounter == 0) {
					self.success();
				}
			},
			unauthorized: function() {
				self.handleError("unauthorized");
			},
			timeout: function() {
				self.handleError("timeout");
			}
		});
	}

	loadResources(neededResources, auth, success) {
		this.unresolvedResourcesCounter = neededResources.length;
		this.auth = auth;
		this.success = success;
		for (let resource of neededResources) {
			if (resource.type == 'script' || resource.name[0] == '#' || resource.type == 'web-component') {
				this.loadScript(resource.url)
			} else if (resource.type == 'template') {
				this.loadTemplate(resource.url, resource.name);
			} else if (resource.type == 'react-component') {
				this.loadReactComponent(resource.url, resource.componentName);
			}	else {
				this.loadBlockingData(resource.url, resource.name);
			}
		}
	}
}
