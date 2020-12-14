const through = require('through2'),
    gutil = require('gulp-util');
const request = require('request');
const path = require('path');

const PLUGIN_NAME = 'gulp-squeezeimg'
const URL = 'https://api.squeezeimg.com/plugin';    //http://localhost:3000/pluginRun'
const EXTENSIONS = ['.jpg', '.png', '.svg','.jpeg' ,'.jp2','.gif','.tiff','.bmp','.PNG','.JPEG','.GIF','.SVG','.TIFF','.BMP',];

module.exports = function (options) {
    if (!options.token) {
        throw gutil.PluginError(PLUGIN_NAME, 'Not token options');
    }
    async function run(file, enc, callback) {
        try {
            if (file.isNull()) {
                this.push(file);
              return callback();
            }
            if( EXTENSIONS.includes(`.${file.relative.split('.').pop()}`)) {
                let req = request.post({ url:URL,strem:true,encoding:'base64'}, (err, resp, body) => {
                    if (err) {
                        this.emit('error', new gutil.PluginError(PLUGIN_NAME, err.message));
                        return callback();
                    } else if(resp.statusCode === 200) {
                        if(options.rename){
                            file.basename = resp.headers["content-disposition"].split('=').pop().replace(/"/g,'');
                        }
                        file.basename  = file.basename.replace(path.extname(file.basename),path.extname(resp.headers["content-disposition"].split('=').pop().replace(/"/g,'')));
                        file.contents = Buffer.from(body,'base64');
                        return callback(null,file);
                    } else if( resp.statusCode !== 504){
                        let str = Buffer.from(body,'base64').toString();
                        let res = JSON.parse(str);
                        this.emit('error', new gutil.PluginError(PLUGIN_NAME, res.error || res.message));
                        return callback();
                    }
                    return callback();
                });
                let formData = req.form(); 
                formData.append('file_name',file.relative);
                formData.append('qlt',options.qlt|| 60);
                formData.append('token',options.token);
                formData.append('method',options.method || 'compress');
                if(options.to)
                    formData.append('to', options.to);
                if (file.isBuffer()) {
                    formData.append('file',file.contents,{ filename:file.relative});
                } 
                if (file.isStream()) {
                    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Not supported stream'));
                    return callback();
                }
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err.message));
            return callback();
        }
    }

    return through.obj(run);
}