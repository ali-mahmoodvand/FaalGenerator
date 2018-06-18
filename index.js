var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        shotdown++;
        cluster.fork();
    });
}
var shotdown = 0;

if (cluster.isWorker) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    var cron = require('node-cron');

    cron.schedule('0 * * * *', function(){
        process.exit(0);
    });
    global.rootDir=__dirname;
    init=require('./modules/init')
    init.initiale()
    app.get('/', function (req, res) {
        res.render("app.html", {});
    })
    app.get('/file', function (req, res) {
        res.render("file.html", {});
    })
    app.post('/file', function (req, res) {
        router.file(req,res);
    });
    app.get('/downloader', function (req, res) {
        res.render("downloader.html", {});
    })
    app.get('/video', function (req, res) {
        res.render("video.html", {});
    })
    app.get('/update', function (req, res) {
        // console.log(parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})));
        // console.log( verpath);
        res.render( "update.html",{
            version:parseInt(fs.readFileSync(verpath, {encoding: 'utf-8'})),
            msg:''
        });
    })
    app.post('/update', function (req, res) {
        router.update2(req,res);
    })
    app.post('/downloader', function (req, res) {
        router.downloader(req,res);
    })
    app.get('/generate', function (req, res) {
        router.generate(req,res);
    });
    app.listen(port, function (err) {
        console.log("port " + port + " listening ... ");
    })
    process.on('uncaughtException', function (exception) {
        console.log(exception)
        process.exit(0);
    })
    process.on('unhandledRejection', function(reason, p) {
        console.log(reason, p)
        process.exit(0);
    });
}