var HtAccessHelper = {}
const fs = require('fs-extra')

var getExpiresByType = function (type, expire) {
    return `ExpiresByType ${type} "${expire}"`
}

var getFileZip = function (filter, type) {
    return `<Files *${filter}.gz>
    AddType "${type}" .gz
    AddEncoding gzip .gz
</Files>
<Files *${filter}.br>
    AddType "${type}" .br
    AddEncoding br .br
</Files>`
}

var getRewriteRuleForZip = function (filter, type) {
    return `RewriteRule \\${filter}\\.br$ - [T=${type},E=no-gzip:1]
RewriteRule \\${filter}\\.gz$ - [T=${type},E=no-gzip:1]`
}

HtAccessHelper.getExistingHtAccessContentByFileList = function(fileList) {
    var contentSoFar = ''

    fileList.map((fileName) => {
        if (fileName.indexOf('.htaccess') > -1) {
            contentSoFar += fs.readFileSync(fileName)
        }
    })

    return contentSoFar
}

HtAccessHelper.getHtAccess = function (settings) {
    var htaccessOptimSettings = settings.optimizer.htaccessOptim.options

    var expireHTML = htaccessOptimSettings.expireHTML
    var expireCommon = htaccessOptimSettings.expire

    var maxageHTML = htaccessOptimSettings.maxageHTML
    var maxageCommon = htaccessOptimSettings.maxage

    var expiresByTypeArrayAsString = [
        'text/css',
        'text/javascript',
        'application/javascript',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/x-icon',
        'image/svg+xml',
        'application/json',
        'application/xml'
    ].map(function (type) {
        return getExpiresByType(type, expireCommon)
    }).join('\r\n')

    var filesToZip = [
        {
            filter: '.js',
            type: 'text/javascript'
        },
        {
            filter: '.css',
            type: 'text/css'
        },
        {
            filter: '.htm',
            type: 'text/htm'
        },
        {
            filter: '.html',
            type: 'text/html'
        },
        {
            filter: '.svg',
            type: 'image/svg+xml'
        },
        {
            filter: '.json',
            type: 'application/json'
        },
        {
            filter: '.xml',
            type: 'application/xml'
        },
        {
            filter: '.webp',
            type: 'image/webp'
        },
        {
            filter: '.jpeg',
            type: 'image/jpeg'
        },
        {
            filter: '.jpg',
            type: 'image/jpeg'
        },
        {
            filter: '.gif',
            type: 'image/gif'
        },
        {
            filter: '.png',
            type: 'image/png'
        },
        {
            filter: '.ttf',
            type: 'application/x-font-ttf'
        },
        {
            filter: '.otf',
            type: 'application/x-font-opentype'
        },
        {
            filter: '.woff',
            type: 'application/font-woff'
        },
        {
            filter: '.woff2',
            type: 'application/font-woff2'
        },
        {
            filter: '.eot',
            type: 'application/vnd.ms-fontobject'
        },
        {
            filter: '.sfnt',
            type: 'application/font-sfnt'
        }
    ]

    var filesZipArrayAsString = filesToZip.map(function (entry) {
        return getFileZip(entry.filter, entry.type)
    }).join('\r\n')

    var rewriteRules = filesToZip.map(function (entry) {
        return getRewriteRuleForZip(entry.filter, entry.type)
    }).join('\r\n')

    return `

# turns cache on for 1 month
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/html "${expireHTML}"
${expiresByTypeArrayAsString}
</IfModule>

<ifmodule mod_headers.c>
<filesmatch "\\.(ico|jpe?g|png|gif|swf|webp|css|js|svg)$">
Header set Cache-Control "max-age=${maxageCommon}, public"
</filesmatch>
<filesmatch "\\.(html|htm)$">
Header set Cache-Control "max-age=${maxageHTML}, public"
</filesmatch>
</ifmodule>

AddType image/webp .webp
FileETag None

${filesZipArrayAsString}

RewriteEngine On

RewriteCond %{HTTP_ACCEPT} image/webp
RewriteRule (.+)\\.(jpe?g|png)$ $1.webp [T=image/webp,E=accept:1]
<IfModule mod_headers.c>
Header append Vary Accept env=REDIRECT_accept
</IfModule>

RewriteCond %{HTTP:Accept-Encoding} br
RewriteCond %{REQUEST_FILENAME}.br -f
RewriteRule ^(.*)$ $1.br [L]

RewriteCond %{HTTP:Accept-Encoding} gzip
RewriteCond %{REQUEST_FILENAME}.gz -f
RewriteRule ^(.*)$ $1.gz [L]

# Serve correct content types, and prevent mod_deflate double br.
${rewriteRules}

`
}

module.exports = HtAccessHelper
