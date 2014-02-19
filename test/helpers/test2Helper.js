MBC.onTemplatesLoaded(function() {
    Template.test2.showBar = function() {
        return '==='+this.bar+'===';
    }
});