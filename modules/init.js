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
        global.prename = "faal";
        global.buildcmd = "./gradlew assembleRelease";
        global.buildpath = "app/build/outputs/apk/app-release.apk";
        global.downloaderbuildpath = "app/app-release.apk";
        global.uploadurl = "http://paydane.ir/app/update/";
        global.verDir=rootDir+"/versions/";
        global.verpath = verDir+"faal";
        global.exec = require('child_process').exec;
        global.ver = parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}));
        app.use(express.static(rootDir + '/public'));
        app.set('views', rootDir + '/public/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        global.bodyParser = require('body-parser');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
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