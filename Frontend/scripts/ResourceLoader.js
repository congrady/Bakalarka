'use strict';

class ResourceLoader {
	loadData(neededData, auth) {
		if (!this.worker) {
      this.worker = new Worker("/Frontend/scripts/ResourceLoaderWorker.js");
		}
		this.worker.addEventListener("message", function(message) {
			App.data[message.data.name] = message.data.response;
		});
		for (let data of neededData) {
			if (auth) {
				this.worker.postMessage({
					"name": data[0],
					url: data[1],
					token: App.token
				});
			} else {
				this.worker.postMessage({
					"name": data[0],
					url: data[1]
				});
			}
		}
	}

	handleError(type) {
		App.router.showError(type);
		this.unresolvedResourcesCounter = -1;
	}

	loadHTML(resourceName, url, auth, success) {
		if (this.unresolvedResourcesCounter == -1) {
			return
		}
		var self = this;
		xhr_get({
			url: url,
			token: auth ? sessionStorage.token : false,
			success: function(response) {
				if (self.unresolvedResourcesCounter == -1) {
					return
				}
				App.htmlTemplates.set(resourceName, response);
				self.unresolvedResourcesCounter -= 1;
				if (self.unresolvedResourcesCounter == 0) {
					success();
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

	loadRestrictedScript(url, success) {
		if (this.unresolvedResourcesCounter == -1) {
			return
		}
		var self = this;
		xhr_get({
			url: url,
			token: sessionStorage.token,
			success: function(response) {
				if (self.unresolvedResourcesCounter == -1) {
					return
				}
				let head = document.getElementsByTagName('head')[0];
				let script = document.createElement('script');
				script.innerHTML = response;
				head.appendChild(script);
				self.unresolvedResourcesCounter -= 1;
				if (self.unresolvedResourcesCounter == 0) {
					success();
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

	loadScript(url, success) {
		if (this.unresolvedResourcesCounter == -1) {
			return
		}
		var self = this;
		let head = document.getElementsByTagName('head')[0];
		let script = document.createElement('script');
		script.src = url;
		script.async = true;
		script.onload = function() {
			if (self.unresolvedResourcesCounter == -1) {
				return
			}
			self.unresolvedResourcesCounter -= 1;
			if (self.unresolvedResourcesCounter == 0) {
				success();
			}
		};
		script.onerror = function() {
			self.handleError("timeout");
		};
		head.appendChild(script);
	}

	loadResources(neededResources, auth, success) {
		this.unresolvedResourcesCounter = neededResources.size;
		for (let resource of neededResources) {
			if (resource[1].endsWith('.js')) {
				if (auth) {
					this.loadRestrictedScript(resource[1], success);
				} else {
					this.loadScript(resource[1], success)
				}
			} else if (resource[1].endsWith(".html")) {
				this.loadHTML(resource[0], resource[1], auth, success);
			}
		}
	}
}
