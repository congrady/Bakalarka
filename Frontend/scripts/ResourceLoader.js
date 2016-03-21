'use strict';

class ResourceLoader {
	constructor(){
		this.unresolvedResourcesCounter = 0;
		this.worker = new Worker("/Frontend/scripts/ResourceLoaderWorker.js");
	}

	loadData(neededData, auth) {
		this.worker.addEventListener("message", function(message) {
			if (AppConfig.dataModels[message.data.name].key){
				let key = AppConfig.dataModels[message.data.name].key;
				App.data[message.data.name] = {};
				let dataResponse = JSON.parse(message.data.response)
				for (let obj of dataResponse){
					App.data[message.data.name][obj[key]] = obj;
				}
			} else {
				App.data[message.data.name] = message.data.response;
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
		this.sendRequest(url, function(response){
			if (AppConfig.dataModels[dataName].key){
				let key = AppConfig.dataModels[dataName].key;
				for (let data of JSON.parse(response)){
					App.data[dataName] = {key: data};
				}
			} else {
				App.data[dataName] = response;
			}
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
