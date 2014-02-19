MBC.onTemplatesLoaded(function() {
    setTimeout(function () {
        Session.set('testing', 'THIS IS FOO AGAIN');
    }, 2000);
});