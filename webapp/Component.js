/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
 sap.ui.define([
    "sap/ui/core/Component",
    "sap/base/Log",
    "sap/ui/core/IconPool"
], function (Component, Log, IconPool) {
    "use strict";
    var sComponentName = "sap.ushell.shellplugin";
    return Component.extend(sComponentName + ".Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {

            //Base64 to Int8 conversion
            var urlBaseArray = function (base64String) {
                var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
                var base64 = (base64String + padding)
                    .replace(/\-/g, "+")
                    .replace(/_/g, "/");

                var rawData = window.atob(base64);
                var outputArray = new Uint8Array(rawData.length);

                for (var i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            };

            var swRegister = async function () {
                try {
                    let originURL = window.location.origin;
                    //Get the deployed component's ID and dynamic URL part to detect the service-worker file's location
                    let swPath = window.sap.cf.fesCDMSite.applications["saas_approuter_demo.shellplugin"]["sap.platform.runtime"].componentProperties.url;
                    let swURL = `${originURL}${swPath}js/sw.js`;
                    console.log(originURL);
                    console.log(swPath);
                    console.log(swURL);
                    navigator.serviceWorker.register(swURL).then(
                        (serviceWorkerRegistration) => {
                            serviceWorkerRegistration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBaseArray(
                                    "BDLac-T8H5XuXXgY7m9kEABpU7HOCgdl1KZIjwk5H9PEzZJHIxIBFhMXv5cNeXcwym5XVbopXMkQc00a7tfi8u4"
                                ),
                            }).then((pushSubscription) => {
                                console.log(pushSubscription.subscriptionId);
                                //Extract the API and keys to send the notification on registered browser
                                console.log(JSON.stringify(pushSubscription));
                                // using, an XMLHttpRequest.
                            },
                                (error) => {
                                    console.error(error);
                                });
                        });
                } catch (error) {
                    console.log(error);
                }
            };

            var oRenderer = sap.ushell.Container.getRenderer();
            var oPluginParameters = this.getComponentData().config;
            var oRecentEntry = {};
            var oShellHeaderItemProperties = {
                tooltip: oPluginParameters.tooltip || "Notification",
                icon: IconPool.getIconURI(oPluginParameters.icon || "message-popup"),
                press: function (evt) {
                    swRegister();
                }
            };

            oRecentEntry.title = oPluginParameters.display_title_text;
            oRecentEntry.url = oPluginParameters.navigation_target_url;
            oRenderer.logRecentActivity(oRecentEntry);

            if (oPluginParameters.position === "end") {
                oRenderer.addHeaderEndItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            } else if (oPluginParameters.position === "begin") {
                oRenderer.addHeaderItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            } else {
                Log.warning("Invalid 'position' parameter, must be one of <begin, end>. Defaulting to 'end'.", undefined, sComponentName);
                oRenderer.addHeaderEndItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            }

            Notification.requestPermission().then().catch((error) => {
                alert("Notification Permission NOT Granted" + perm + "!!!");
                console.log(error);
            });
        }
    });
});