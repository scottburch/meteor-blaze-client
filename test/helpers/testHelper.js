MBC.onTemplatesLoaded(function() {
    Template.test.foo = function () {
        return Session.get('testing');
    };

    MBC.renderTemplate('test', '#tempTemplate');

});