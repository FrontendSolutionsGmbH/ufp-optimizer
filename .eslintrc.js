module.exports = {
    "extends": [
        "standard"
    ],
    "plugins": [
        "filenames",
        "flowtype",
        "import",
        "promise",
        "babel",
        "immutable",
        "no-use-extend-native",
        "no-inferred-method-name",
        "jasmine"
    ],
    "env": {
        "browser": true,
        "jasmine": true
    },
    "globals": {
        "Action": false,
        "__DEV__": false,
        "__PROD__": false,
        "__DEBUG__": false,
        "__DEBUG_NEW_WINDOW__": false,
        "__BASENAME__": false,
        "__PORTALTYPE__": "real",
        "__BUILDVERSION__": "buildstring",
        "__BUILDTIME__": "buildtime",
        "__NPMVERSION__": "1.0.13",
        "__DEFAULT_THEME__": "defaultTheme",
        "__SHOW_CONSOLE__": true,
        "__APP__": "admin"
    },
    "rules": {
        "arrow-body-style": [
            0,
            "as-needed",
        ],
        "padded-blocks": [
            2,
            {
                "blocks": "never",
                "classes": "always",
                "switches": "never"
            }
        ],
        "immutable/no-let": 2,
        "immutable/no-this": 0,
        "immutable/no-mutation": 0,
        "promise/always-return": 2,
        "no-webpack-loader-syntax": 0,
        "promise/no-return-wrap": 2,
        "promise/param-names": 2,
        "promise/catch-or-return": 0,
        "promise/no-native": 0,
        "promise/no-nesting": 2,
        "promise/no-promise-in-callback": 2,
        "promise/no-callback-in-promise": 2,
        "promise/avoid-new": 0,
        "no-empty": 2,
        "no-use-extend-native/no-use-extend-native": 2,
        "space-before-function-paren": 0,
        "semi": [
            2,
            "never"
        ],
        "quotes": [
            2,
            "single"
        ],
        "no-undef": [
            2
        ],
        "space-infix-ops": 0,
        "no-unused-vars": [
            2,
            {
                "vars": "all",
                "args": "after-used"
            }
        ],
        "filenames/match-exported": [
            2,
            /*
             // path for eslint-filenames to allow camelcase first letter up, replace the next code in eslint plugin
             replace
             camel: require('lodash.camelcase')
             with:
             camel: function (string){
             return require('lodash.upperfirst')(require('lodash.camelcase')(string))
             }

             */

            "pascal"
        ],
        "prefer-const": [
            2,
            {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false
            }
        ],
        "object-curly-spacing": [
            2,
            "never"
        ],
        "no-duplicate-imports": 0,
        "no-unsafe-finally": 0,
        "no-useless-computed-key": 0,
        "no-useless-escape": 0,
        "arrow-spacing": 2,
        "arrow-parens": 2,
        "camelcase": 2,
        "operator-linebreak": 0,
        "brace-style": 0,
        "indent": 0,
        "spaced-comment": 0,
        "rest-spread-spacing": 0,
        // fixme: include vars on top
        "vars-on-top": 0,
        // "complexity": [1, 10],
        "complexity": 0,
    }
};