const through = require('through2'),
    gutil = require('gulp-util');
const request = require('request');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const PLUGIN_NAME = 'gulp-squeezeimg'
const URL = 'http://localhost:3000/plugin'; 
const EXTENSIONS = ['.jpg', '.png', '.svg','.jpeg' ,'.jp2','.gif','.tiff','.bmp','.PNG','.JPEG','.GIF','.SVG','.TIFF','.BMP',];
const logger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(__dirname, 'error.log'),
            level: 'error',
            maxsize: 500
        })
    ],
    handleExceptions : true,
    colorize: true,
    exitOnError: false
});

module.exports = function (options) {
    async function run(file, enc, callback) {
        try {
            if (!options.token) {
                throw new gutil.PluginError(PLUGIN_NAME, 'Not token options');
            }
            if (file.isNull()) {
                this.push(file);
              return callback();
            }
            if( EXTENSIONS.includes(`.${file.relative.split('.').pop()}`)) {
                let req = request.post({ url:URL,strem:true,encoding:'binary'}, (err, resp, body) => {
                    if (err) {
                        logger.error(`${PLUGIN_NAME} ${err.message}`)
                        return callback();
                    } else if(resp.statusCode === 200) {
                        if(options.rename){
                            file.basename = resp.headers["content-disposition"].split('=').pop().replace(/"/g,'');
                        }
                        file.basename  = file.basename.replace(path.extname(file.basename),path.extname(resp.headers["content-disposition"].split('=').pop().replace(/"/g,'')));
                        file.contents = Buffer.from(body,'binary');
                        return callback(null,file);
                    } else if( resp.statusCode > 200 ){
                        let str = Buffer.from(body,'binary').toString();
                        let res = {};
                        try {
                            res = JSON.parse(str);
                        } catch(err) {}
                        logger.error(`${PLUGIN_NAME} ${res.error.message || res.message || str}`)
                        return callback();
                    }
                    return callback();
                });
                let formData = req.form(); 
                formData.append('file_name',file.relative);
                formData.append('qlt',options.qlt|| 60);
                formData.append('token',options.token);
                formData.append('source',"Plugin : Gulp");
                formData.append('method',options.method || 'compress');
                formData.append('to', options.to || 'webp');
                if (file.isBuffer()) {
                    formData.append('file',file.contents,{ filename:file.relative});
                } 
                if (file.isStream()) {
                    logger.error(`${PLUGIN_NAME} Not supported stream.`)
                    return callback();
                }
            }
        } catch (err) {
            logger.error(`${PLUGIN_NAME} ${err.message}`)
            return callback();
        }
    }

    return through.obj(run);
}   