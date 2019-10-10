const fs = require('fs');
const events = require('events');
const myEmitter = new events.EventEmitter();
const path = require('path');
const savedFilesPath = path.join(__dirname, '../savedFiles');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (app) => {
	app.get('/delete/:name?', (req, res) => {
		let data = {
			files: [],
			previewFile: null
		}
		fs.readdir(savedFilesPath, (err, files) => {
			if (err) { return console.log("Couldn't scan directory, reason: "+err);}
			files.forEach((file) => {
				data.files.push(file)
			});
			fs.unlink('./savedFiles/'+req.params.name, (err) => {
				if (err) throw err;
				console.log('File deleted!');
				res.render('index', {data: data});
			});
		});
	})

	app.get('/:name?', (req, res) => {
		let data = {
			files: [],
			fileTitle: null,
			previewFile: null
		}
		fs.readdir(savedFilesPath, (err, files) => {
			if (err) { return console.log("Couldn't scan directory, reason: "+err);}
			files.forEach((file) => {
				data.files.push(file)
			});
			//display file in the preview section including update
			fs.readFile('./savedFiles/'+req.params.name, 'utf8', (err, dataresp) => {
			  data.previewFile = dataresp;
			  data.fileTitle = req.params.name;
				res.render('index', { data: data });
			});
		});
	});

	app.post('/', urlencodedParser, (req, res) => {
		if (!req.body) return res.sendStatus(400)

		const dataInfo = req.body;
		let data = {
			files: [],
			previewFile: null
		}
		//check file content and type, then save file based on file type
		if(dataInfo.infoTitle != ""){
			if(dataInfo.infoType === ".html"){
				fs.writeFile('./savedFiles/'+dataInfo.infoTitle+dataInfo.infoType, dataInfo.infoBody, (err) => {
					if (err) throw err;
					console.log('written!');
				});
			} else if(dataInfo.infoType === ".txt"){
				fs.writeFile('./savedFiles/'+dataInfo.infoTitle+dataInfo.infoType, dataInfo.infoBody, (err) => {
					if (err) throw err;
					console.log('written!');
				});
			}
		} else {
			console.log('File title cannot be empty');
		}

		//read directory and render file in preview
		fs.readdir(savedFilesPath, (err, files) => {
			if (err) { return console.log("Couldn't scan directory, reason: "+err);}
			files.forEach((file) => {
				data.files.push(file)
			});
			data.previewFile = dataInfo.infoBody;
			res.render('index', { data: data });
		});
	});
};