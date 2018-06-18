/**
 * Created by ali on 6/5/18.
 */
module.exports= {
    update: (req,res) => {
        if(req.body.versions&&req.body.versions.length>0){
            const jobs=[];
            const links=[];
            const init=(callback)=>{
                callback(null,parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})));
            };
            jobs.push(init)
            if(!Array.isArray(req.body.versions)){
                req.body.versions=[req.body.versions];
            }
            for(i=0;i<req.body.versions.length;i++){
                job=(nextVersion,previusVersion,callback)=>{
                    console.log('start scanning');
                    scanner.scanDirAndReplace(appPath,previusVersion,nextVersion,prename);
                    console.log('finish scanning');
                    console.log('start build');

                    let cmd = appPath + buildcmd;
                         exec(buildcmd, option,
                        function (err, data, stderr) {
                            console.log('finish build');
                            if (!err) {
                                let nextfile = rootDir + "/apks/" + dateformat(new Date, "yyyy-mm-dd=HH:MM:ss").toString() + " " +
                                    prename + (nextVersion).toString()+"_"+req.body.version + ".apk";
                                fsex.copySync(appPath + buildpath, nextfile);
                                util.uploader(nextfile,uploadurl,(err,response)=>{
                                    console.log(err,response)
                                    links.push({
                                        appname:prename+nextVersion.toString(),
                                        msg:response
                                    })
                                    callback(null, nextVersion);
                                });
                            }else {
                                links.push({
                                    appname:prename+nextVersion.toString(),
                                    msg:JSON.stringify(err)
                                })
                                console.log(err,stderr)
                                callback(null,nextVersion);
                            }
                        })
                };
                jobs.push(job.bind(null,parseInt(req.body.versions[i])));
            }
            const finish=(nextVersion,previusVersion,callback)=>{
                scanner.scanDirAndReplace(appPath,previusVersion,nextVersion,prename);
                callback(null,nextVersion);
            }
            jobs.push(finish.bind(null,parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}))));

            async.waterfall(jobs,function (err,result) {
                let msg='';
                links.map((item,index)=>{
                    if(item.msg&&item.msg.split('.').pop()==='apk')
                    msg+='<div><a href="'+item.msg+'">'+item.appname+'</a></div>';
                    else
                        msg+='<div>'+item.appname+'  :<p>'+item.msg+'</p>  </div>';
                });
                res.render("update.html",{
                    version:parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})),
                    msg:msg,
                });
            })
        }else{
            res.render( "update.html",{
                version:parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})),
                msg:'list is empty'
            });
        }
    },
    generate:(req,res)=>{
        ver = parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}));
        console.log('start scanning',appPath,ver,ver+1,prename);
        scanner.scanDirAndReplace(appPath,ver,ver+1,prename);
        console.log('finish scanning');
        let cmd = appPath + buildcmd;
        option.cwd=appPath;
        console.log('start build');
        exec(buildcmd, option,
            function (err, data, stderr) {
                console.log('finis build');
                console.dir(err);
                // console.dir(data);
                console.dir(stderr);
                if (!err) {
                    let nextfile = rootDir + "/apks/" + dateformat(new Date, "yyyy-mm-dd=HH:MM:ss").toString() + " " +
                        prename + (ver + 1).toString() + ".apk";
                    fsex.copySync(appPath + buildpath, nextfile);
                    fs.writeFileSync(verpath, (ver + 1).toString());
                    ver = parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}));
                    res.download(nextfile);
                }
                else {
                    res.send(JSON.stringify(stderr) + JSON.stringify(err));
                }
            })
    },
    file:(req,res)=>{
        let fileVerPath=verDir+"file"
        let ver = parseInt(fs.readFileSync(fileVerPath, {encoding: 'utf-8'}));
        // console.log(ver,fileVerPath,fs.readFileSync(fileVerPath, {encoding: 'utf-8'}));
        // return;
            
        const prename='file';
        console.log('start scanning',filePath,ver,ver+1,prename);
        scanner.scanDirAndReplace(filePath,ver,ver+1,prename);
        console.log('finish scanning');
        option.cwd=filePath;
        console.log('start build');
        exec(buildcmd, option,
            function (err, data, stderr) {
                console.log('finis build');
                console.dir(err);
                // console.dir(data);
                console.dir(stderr);
                if (!err) {
                    let nextfile = rootDir + "/apks/" + dateformat(new Date, "yyyy-mm-dd=HH:MM:ss").toString() + " " +
                        prename +"_"+ (ver + 1).toString() + ".apk";
                    console.log(nextfile);
                    fsex.copySync(filePath + buildpath, nextfile);
                    fsex.copySync(filePath + buildpath, appRawPath);
                    fs.writeFileSync(fileVerPath, (ver + 1).toString());
                    //util.uploader(nextfile,fileuploadurl,(err,response)=>{
                      //  console.log(err,response)
                        res.download(nextfile);
                    //});
                }
                else {
                    res.send(JSON.stringify(stderr) + JSON.stringify(err));
                }
            })
    },
    downloader:(req,res)=>{
        let downloaderverpath=verDir+req.body.downloader;
        let downloaderver = parseInt(fs.readFileSync(downloaderverpath, {encoding: 'utf-8'}));
        let downloaderDir=downloaderPath+req.body.downloader.capitalize()+"/";
        console.log("start scan",downloaderDir,downloaderver,downloaderver+1,'downloader')
        scanner.scanDirAndReplace(downloaderDir,downloaderver,downloaderver+1,'downloader');
        console.log("finish scan",downloaderDir,downloaderver,downloaderver+1,'downloader')

        let cmd = appPath + buildcmd;
        option.cwd=downloaderDir
        console.log("start build")

        exec(buildcmd, option,
            function (err, data, stderr) {
                console.dir(err);
                // console.dir(data);
                console.dir(stderr);
                if (!err) {
                    console.log("finish build")
                    let nextfile = rootDir + "/apks/" + dateformat(new Date, "yyyy-mm-dd=HH:MM:ss").toString() + " " +
                        'downloader' + (downloaderver + 1).toString() + ".apk";
                    fsex.copySync(downloaderDir + buildpath, nextfile);
                    fs.writeFileSync(downloaderverpath, (downloaderver + 1).toString());
                    res.download(nextfile);
                }
                else {
                    res.send(JSON.stringify(stderr) + JSON.stringify(err));
                }
            })
    },
    update2: (req,res) => {
        if (req.body.versions && req.body.versions.length > 0) {
            if(!Array.isArray(req.body.versions)){
                req.body.versions=[req.body.versions];
            }
            const links=[];
            async.eachSeries(req.body.versions, (nextVersion, callback) => {
               const key=req.body.versions.indexOf(nextVersion);
                if(key==0){
                    previusVersion=parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}))
                }else{
                    previusVersion=req.body.versions[key-1];
                }
                console.log('start scanning',nextVersion, key);
                scanner.scanDirAndReplace(appPath,previusVersion,nextVersion,prename);
                console.log('finish scanning');
                console.log('start build');

                exec(buildcmd, option,
                    function (err, data, stderr) {

                        console.log('finish build');
                        if(!links[key]) {
                            if (!err) {
                                let nextfile = rootDir + "/apks/" + dateformat(new Date, "yyyy-mm-dd=HH:MM:ss").toString() + " " +
                                    prename + (nextVersion).toString() + "_" + req.body.version + ".apk";
                                fsex.copySync(appPath + buildpath, nextfile);
                                util.uploader(nextfile, uploadurl, (err, response) => {
                                    console.log(err, response)
                                    links[key] = {
                                        appname: prename + nextVersion.toString(),
                                        msg: response
                                    };
                                    callback();
                                });
                            } else {
                                links[key] = {
                                    appname: prename + nextVersion.toString(),
                                    msg: JSON.stringify(err)
                                }
                                console.log(err, stderr)
                                callback();
                            }
                        }
                        else{
                            console.log('key exist');
                            callback();
                        }
                    })
            }, err => {
                scanner.scanDirAndReplace(appPath,req.body.versions[req.body.versions.length-1],
                    parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'}))
                    ,prename);
                let msg='';
                links.map((item,index)=>{
                    if(item.msg&&item.msg.split('.').pop()==='apk')
                        msg+='<div><a href="'+item.msg+'">'+item.appname+'</a></div>';
                    else
                        msg+='<div>'+item.appname+'  :<p>'+item.msg+'</p>  </div>';
                });
                res.render("update.html",{
                    version:parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})),
                    msg:msg,
                });
            });
        }
    },
}