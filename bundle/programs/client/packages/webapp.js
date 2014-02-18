//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var WebApp;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/webapp/webapp_client.js                                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
WebApp = {                                                           // 1
                                                                     // 2
  _isCssLoaded: function () {                                        // 3
    return _.find(document.styleSheets, function (sheet) {           // 4
      if (sheet.cssText && !sheet.cssRules) // IE8                   // 5
        return sheet.cssText.match(/_meteor_detect_css/);            // 6
      return _.find(sheet.cssRules, function (rule) {                // 7
        return rule.selectorText === '._meteor_detect_css';          // 8
      });                                                            // 9
    });                                                              // 10
  }                                                                  // 11
};                                                                   // 12
                                                                     // 13
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.webapp = {
  WebApp: WebApp
};

})();

//# sourceMappingURL=87383e62e7a152277571ae1a71f7f8198ebd7a8a.map
