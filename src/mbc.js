(function (global) {
    var onTemplatesLoadedListeners = [];

    var MBC = global.MBC = {};

    MBC.renderTemplate = function (templateName, elOrSelector) {
        var el = _.isString(elOrSelector) ? $(elOrSelector).get(0) : elOrSelector;
        el && UI.DomRange.insert(UI.render(Template[templateName]).dom, el);
    };

    MBC.scanHtml = function(html) {
        var r = html_scanner.scan(html);
        r.js && eval(r.js);
    };

    MBC.templatesLoaded = function() {
        MBC.onTemplatesLoaded = function(cb) {cb()};
        _.each(onTemplatesLoadedListeners, function(cb) {cb()});
    };

    MBC.onTemplatesLoaded = onTemplatesLoadedListeners.push.bind(onTemplatesLoadedListeners);

}(this));
