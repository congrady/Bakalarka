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

  loadScript(neededResources, success) {
    let unresolvedResourcesCounter = neededResources.size;
    let $head = document.getElementsByTagName('head')[0];
    for (let resource of neededResources) {
      if (resource[1].endsWith('.js')) {
        let $script = document.createElement('script');
        $script.src = resource[1];
        $script.async = true;
        $script.onload = function() {
          if (unresolvedResourcesCounter == -1) {
            return
          }
          unresolvedResourcesCounter -= 1;
          if (unresolvedResourcesCounter == 0) {
            success();
          }
        };
        $script.onerror = function() {
          unresolvedResourcesCounter = -1;
          App.router.showError("timeout");
        };
        $head.appendChild($script);
      } else if (resource[1].endsWith(".html")) {
        xhr_get({
          url: resource[1],
          success: function(response) {
            if (unresolvedResourcesCounter == -1) {
              return
            }
            App.htmlTemplates.set(resource[0], response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0) {
              success();
            }
          },
          timeout: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("timeout");
          }
        });
      } else {
        xhr_get({
          url: resource[1],
          success: function(response) {
            if (unresolvedResourcesCounter == -1) {
              return
            }
            App.data[resource[0]] = JSON.parse(response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0) {
              success();
            }
          },
          timeout: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("timeout");
          }
        });
      }
    }
  }
  loadRestrictedScript(neededResources, success) {
    let unresolvedResourcesCounter = neededResources.size;
    let $head = document.getElementsByTagName('head')[0];
    for (let resource of neededResources) {
      if (resource[1].endsWith('.js')) {
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response) {
            if (unresolvedResourcesCounter == -1) {
              return
            }
            let $script = document.createElement('script');
            $script.innerHTML = response;
            $head.appendChild($script);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0) {
              success();
            }
          },
          unauthorized: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("unauthorized");
          },
          timeout: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("timeout");
          }
        });
      } else if (resource[1].endsWith(".html")) {
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response) {
            if (unresolvedResourcesCounter == -1) {
              return
            }
            App.htmlTemplates.set(resource[0], response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0) {
              success();
            }
          },
          unauthorized: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("unauthorized");
          },
          timeout: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("timeout");
          }
        });
      } else {
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response) {
            if (unresolvedResourcesCounter == -1) {
              return
            }
            App.data[resource[0]] = JSON.parse(response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0) {
              success();
            }
          },
          unauthorized: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("unauthorized");
          },
          timeout: function() {
            unresolvedResourcesCounter = -1;
            App.router.showError("timeout");
          }
        });
      }
    }
  }
}
