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

    MBC.loadTemplates = function(templateFiles, cb) {
        $.get(templateFiles[0], function(html) {
            MBC.scanHtml(html);
            templateFiles.length > 1 ? MBC.loadTemplates(templateFiles.slice(1)) : cb();
        });
    };

    MBC.loadTemplate = function(filename, cb) {
        $.get(filename, function(text) {
            MBC.scanHtml(text);
            cb();
        });
    }

}(this));
