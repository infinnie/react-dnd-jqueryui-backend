/// <reference path="../../lib/jquery-ui.js"/>
"use strict";

var $ = (window && window.jQuery) || require("jquery"),
    jQuery = $,
    invariant = require("invariant");

require("../../lib/jquery-ui.js");

var jQueryUIBackEnd = function (manager) {
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.registry = manager.getRegistry();

    this.sourceNodes = {};
    this.sourceNodeOptions = {};
    this.sourcePreviewNodes = {};
    this.sourcePreviewNodeOptions = {};
    this.targetNodes = {};
    this.targetNodeOptions = {};
    this._mouseClientOffset = {};
    this.matchingTargetIds = [];
    this.getSourceClientOffset = this.getSourceClientOffset.bind(this);
    this.handleDrop = (function (that) {
        return function () {
            that.actions.drop();
            that.actions.endDrag();
        };
    })(this);
};

jQueryUIBackEnd.prototype = {
    setup: function () {
        var that = this;
        if (typeof window === "undefined") {
            return;
        }
        if (jQueryUIBackEnd.isSetUp) {
            invariant(jQueryUIBackEnd.isSetUp, "Test");
        }
        jQueryUIBackEnd.isSetUp = true;
        // TODO

        $(document).on("drop", this.handleDrop);
    },
    teardown: function () {
        if (typeof window === "undefined") {
            return;
        }
        jQueryUIBackEnd.isSetUp = false;
        this._mouseClientOffset = {};
        this.matchingTargetIds.length = 0;
        // TODO
        // this.uninstallSourceNodeRemovalObserver();
        $(document).off("drop", this.handleDrop);
    },
    connectDragSource: function (sourceId, node, options) {
        /// <param name="node" type="HTMLElement"/>
        /// <param name="options" type="Object"/>
        var that = this;
        this.sourceNodes[sourceId] = node;
        $(node).draggable({
            // revert: true,
            create: function () { },
            start: function () {
                // TODO
                that.actions.beginDrag([sourceId], {
                    publishSource: false
                });
            }, drag: function (ev, ui) {
                that.actions.publishDragSource();
            }, stop: function () {
                $(this).css("cssText", "");
            }
        });
        return function () {
            delete that.sourceNodes[sourceId];
            try { $(node).draggable("destroy"); } catch (e) { }
        };
    },
    connectDragPreview: function (sourceId, node, options) {
        // TODO
    },
    connectDropTarget: function (targetId, node) {
        // TODO
        var that = this;
        this.targetNodes[targetId] = node;
        $(node).droppable({
            drop: function (event, ui) {
                // that.actions.drop();
                //if ($(document.body).has(ui.draggable).length) {
                //    return;
                //}
                // that.actions.endDrag();
            }, over: function (event, ui) {
                if (that.matchingTargetIds.indexOf(targetId) === -1) {
                    that.matchingTargetIds.unshift(targetId);
                }
                that.actions.hover(that.matchingTargetIds, {});
            }, out: function () {
                that.matchingTargetIds.splice(that.matchingTargetIds.indexOf(targetId), 1);
            }
        });
        return function () {
            delete that.targetNodes[targetId];
            $(node).droppable("destroy");
        };
    },
    getSourceClientOffset: function (sourceId) {
        // TODO
    },
    handleStart: function (sourceId) {
        //this.touchStartSourceIds.unshift(sourceId);
    },
    installSourceNodeRemovalObserver: function (node) { },
    resurrectSourceNode: function () { },
    uninstallSourceNodeRemovalObserver: function () { },
};

module.exports = function (manager) {
    return new jQueryUIBackEnd(manager);
}
