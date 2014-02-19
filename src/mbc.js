(function (global) {
    global.MBC = {};

    global.MBC.renderTemplate = function (templateName, elOrSelector) {
        var el = _.isString(elOrSelector) ? $(elOrSelector).get(0) : elOrSelector;
        el && UI.DomRange.insert(UI.render(Template[templateName]).dom, el);
    };

}(this));
