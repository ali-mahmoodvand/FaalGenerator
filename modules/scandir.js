/**
 * Created by ali on 6/5/18.
 */
module.exports={
    scanDirAndReplace:(path,version,nextVersion,preName)=>{
        let dir = fs.readdirSync(path);
        for (let i = 0; i < dir.length; i++) {
            if (dir[i][0] != ".") {
                let curtarget = path + dir[i];
                //console.log(path,version)
                let curver = preName + version.toString()
                let nextver = preName + (nextVersion).toString()
                let nexttarget = curtarget.replace(curver, nextver);
                if (curtarget.indexOf(curver) != -1) {
                    //console.log(curtarget);
                    //console.log(nexttarget);
                    fs.renameSync(curtarget, nexttarget);
                }
                let stat = null;
                try {
                    stat = fs.lstatSync(nexttarget)
                } catch (err) {
                    // console.log(err.message,nexttarget);
                }
                if (stat && stat.isDirectory()&&dir[i]!="build") {
                    scanner.scanDirAndReplace(nexttarget + "/",version,nextVersion,preName);
                }
                else if ((
                    nexttarget.indexOf(".java") != -1 ||
                    nexttarget.indexOf(".xml") != -1 ||
                    nexttarget.indexOf(".gradle") != -1)){
                    let text = fs.readFileSync(nexttarget, {encoding: 'utf-8'});
                    let regx = new RegExp(curver, "g");
                    text = text.replace(regx, nextver)
                    fs.writeFileSync(nexttarget, text);
                }
            }
        }
    }
}