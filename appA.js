var express = require('express');
var app = express();
var port = process.env.PORT || 7777;
var path = require('path');
var bodyParser = require("body-parser");

// configuration du client mysql
var mysql = require('mysql');
var clientMysql = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: "yannick",
	password: 'yann',
	database: "nodeTeste"
});

// rendu des fichier static
app.use(express.static("public"));
// gestion du rendu des vue

app.set('views', './');
app.set("views engine", 'ejs');
app.engine('html', require('ejs').renderFile);

// routage
app.get('/', function(req, res){
	console.log('acceuil')
	res.render('acceuil.html');
});
app.get('/nouvelle_partie', function(req, res){
	console.log('nouvelle partie');
	var delete_partie = `DELETE FROM NodeTable2`;
	clientMysql.query(delete_partie, function(err, results, fields){
		if(err){
			res.send(new Error(err));
		}else{
			res.render('acceuil.html', {
				infos:results
			});
		}
	});
});
app.get('/', function(req, res){
	console.log("apropos");
	res.render("https://www.wikipedia.org/");
});
app.get('/indexA', function(req, res){
	console.log('indexA');
	var get_infos = `SELECT * FROM NodeTable2 ORDER BY valeur DESC, abc ASC, valeur_X ASC, valeur_Y ASC, valeurCC DESC`;
	clientMysql.query(get_infos, function(err, results, fields){
		if(err){
			res.send(new Error(err));
		}else{
			res.render('indexA.html', {
				infos:results
			});
		}
	});
});
// routage insertion des elment des champs
app.post('/abcdatas', bodyParser.urlencoded({ extended:false}), function(req, res){
	//console.log('req.body news', req.body);
	var {description, valeur} = req.body;
	if(req.body){
		//console.log("req.body avant d'inserer les valeur du champs", req.body);
		var insertDatas = `INSERT INTO NodeTable2 (description, valeur) VALUES (?,?)`;
		clientMysql.query(insertDatas, [description, valeur], function(err, results, fields){
					//console.log(results, fields);
			if(err){
				res.send(new Error(err));
			}else{
				res.send({
					id: results.insertId,
					description: description,
					valeur: valeur,
				});
			}
		});
	}else{
		res.send("veillez rensengner tout les champs body");
	}
}); 
// routage traitemant du formulaire
app.post('/datas', bodyParser.urlencoded({ extended:false}), function(req, res){
	console.log('req.body news', req.body);
	var {valeur_X, valeur_Y, abc, valeurCC, id} = req.body;
	if(req.body != {} && valeur_X && valeur_Y && abc && valeurCC){
			console.log("req.body avant la modification", req.body);
		var update_Datas = `UPDATE NodeTable2 SET valeur_X =?, valeur_Y=?, abc=?, valeurCC=? WHERE id=?`;
		clientMysql.query(update_Datas, [valeur_X, valeur_Y, abc, valeurCC, id], function(err, results, fields){
			console.log(results, fields);
			console.log(valeur_X, valeur_Y, valeurCC, abc);
			if(err){
				res.send(new Error(err));
				console.log('si ya erreur affiche ', valeur_X, valeur_Y, abc);
			}else{
				res.send({
					id: results.insertId,
					valeur_X: valeur_X,
					valeur_Y: valeur_Y,
					abc : abc,
					valeurCC : valeurCC
				});
			}
		});
	}else{
		res.send("veillez rensengner tout les champs body");
	}
});
app.post('/update', bodyParser.urlencoded({ extended:false}), function(req, res){
	console.log('req.body news', req.body);
	var {nouvelle_description, nouvelle_valeur, nouvelle_id} = req.body;
	if(req.body){
		console.log("req.body avant updates", req.body);
		var updateDatas = `UPDATE NodeTable2 SET description =?, valeur=? WHERE id=?`;
		clientMysql.query(updateDatas, [nouvelle_description, nouvelle_valeur, nouvelle_id], function(err, results, fields){
			if(err){
				res.send(new Error(err));
			}else{
				res.send({
					id: results.insertId,
					description: nouvelle_description,
					valeur: nouvelle_valeur
				});
			}
		});
	}
});

app.listen(port, function(err){
	if(err){
		console.log('erreur au niveau du serveur');
	}else{
		console.log("Le serveur nodeJs a demarer sur le port : " + port);
	}
});