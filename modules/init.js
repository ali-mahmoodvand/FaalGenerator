/**
 * Created by ali on 6/5/18.
 */
module.exports={
    initiale:()=>{
        global.express = require('express')
        global.async = require('async')
        global.request = require('request')
        global.fs = require('fs')
        global.dateformat = require('dateformat')
        global.fsex = require('fs-extra');
        global.app = express()
        global.port = 3000;
        global.appPath = "/home/ali/Documents/apps/Downloaders/FaalGenerator/";
        global.downloaderPath = "/home/ali/Documents/apps/Downloaders/";
        global.filePath = "/home/ali/Documents/apps/Downloaders/FileManagement/";
        global.prename = "faal";
        global.buildcmd = "./gradlew assembleRelease";
        global.buildpath = "app/build/outputs/apk/app-release.apk";
        global.downloaderbuildpath = "app/app-release.apk";
        global.uploadurl = "http://paydane.ir/app/update1/";
        global.fileuploadurl = "http://paydane.ir/app/file/";
        global.verDir=rootDir+"/versions/";
        global.verpath = verDir+"faal";
        global.appRawPath="/home/ali/Documents/apps/Downloaders/FaalGenerator/app/src/main/res/raw/app.apk";
        global.exec = require('child_process').exec;
        global.ver = parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}));
        app.use(express.static(rootDir + '/public'));
        app.set('views', rootDir + '/public/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        global.bodyParser = require('body-parser');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        var timeout = require('connect-timeout'); //express v4
        function haltOnTimedout(req, res, next){
            if (!req.timedout) next();
        }
        app.use(timeout(1200000));
        app.use(haltOnTimedout);


        global.option = {
            cwd: appPath,
            env: process.env
        };

        //own modules
        global.scanner=require('./scandir')
        global.generate=require('./generate')
        global.update=require('./update')
        global.util=require('./util')
        global.router=require('./router')
    }
}