var HtAccessHelper = {}

HtAccessHelper.getHtAccess = function (settings) {
    var htaccessOptimSettings = settings.optimizer.htaccessOptim.options

    var expireHTML = htaccessOptimSettings.expireHTML
    var expireCommon = htaccessOptimSettings.expire

    var maxageHTML = htaccessOptimSettings.maxageHTML
    var maxageCommon = htaccessOptimSettings.maxage

    return `

# turns cache on for 1 month
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css ${expireCommon}"
ExpiresByType text/javascript ${expireCommon}"
ExpiresByType text/html "${expireHTML}"
ExpiresByType application/javascript "${expireCommon}"
ExpiresByType image/gif ${expireCommon}"
ExpiresByType image/jpeg ${expireCommon}"
ExpiresByType image/png ${expireCommon}"
ExpiresByType image/x-icon ${expireCommon}"
ExpiresByType image/svg+xml ${expireCommon}"
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

<Files *.js.gz>
AddType "text/javascript" .gz
AddEncoding gzip .gz
</Files>
<Files *.css.gz>
AddType "text/css" .gz
AddEncoding gzip .gz
</Files>
<Files *.htm.gz>
AddType "text/htm" .gz
AddEncoding gzip .gz
</Files>
<Files *.html.gz>
AddType "text/html" .gz
AddEncoding gzip .gz
</Files>
<Files *.svg.gz>
AddType "image/svg+xml" .gz
AddEncoding gzip .gz
</Files>

<Files *.js.br>
AddType "text/javascript" .br
AddEncoding br .br
</Files>
<Files *.css.br>
AddType "text/css" .br
AddEncoding br .br
</Files>
<Files *.htm.br>
AddType "text/html" .br
AddEncoding br .br
</Files>
<Files *.html.br>
AddType "text/html" .br
AddEncoding br .br
</Files>
<Files *.svg.br>
AddType "image/svg+xml" .br
AddEncoding br .br
</Files>

RewriteEngine On

RewriteCond %{HTTP_ACCEPT} image/webp
RewriteRule (.+)\.(jpe?g|png)$ $1.webp [T=image/webp,E=accept:1]
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
    RewriteRule \.css\.br$ - [T=text/css,E=no-gzip:1]
RewriteRule \.js\.br$ - [T=text/javascript,E=no-gzip:1]
RewriteRule \.html\.br$ - [T=text/html,E=no-gzip:1]
RewriteRule \.htm\.br$ - [T=text/html,E=no-gzip:1]
RewriteRule \.svg\.br$ - [T=image/svg+xml,E=no-gzip:1]


# Serve correct content types, and prevent mod_deflate double gzip.
    RewriteRule \.css\.gz$ - [T=text/css,E=no-gzip:1]
RewriteRule \.js\.gz$ - [T=text/javascript,E=no-gzip:1]
RewriteRule \.html\.gz$ - [T=text/html,E=no-gzip:1]
RewriteRule \.htm\.gz$ - [T=text/html,E=no-gzip:1]
RewriteRule \.svg\.gz$ - [T=image/svg+xml,E=no-gzip:1]
    
        `
}

module.exports = HtAccessHelper
