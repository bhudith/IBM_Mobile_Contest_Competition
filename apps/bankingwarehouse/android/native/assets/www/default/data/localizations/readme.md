Both Android and iOS follow the ISO 639-1 codes
http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

The mapping between the language codes to their respective culture and language files is listed in mapping.json
if a language file does not exist for a user's chosen language, it will fallback to neutral english, en, as by Globalize.js
https://github.com/jquery/globalize#defining

Because culture files are js files, they are loaded in using requireJS; while as language files are json files 
so the paths in the mapping look different even though these files may all reside under the same root directory 