/*global QUnit*/

sap.ui.define([
	"demo/shellplugin/controller/shellView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("shellView Controller");

	QUnit.test("I should test the shellView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
