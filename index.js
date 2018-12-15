const express = require ( 'express' );
const mysql = require ( 'mysql' );
const app = express();
const bodyParser = require ( 'body-parser' );
var db = mysql.createConnection({
	host: "localhost" ,
	user: "root" ,
	password: "" ,
	database: "lab" ,
	port: "3306"
});
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PARE_FEU
app.use( function (req, res, next) {
	if ( "key" in req.query) {
		var key = req.query[ "key" ];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			if (result.length > 0 ) {
				next();
			}
			else {
				res.send( "Access denied",403);
			}
		});
	} else {
		res.send( "Access denied",403);
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ANIMALS

//ANIMALS_GET(READ)
app.get( '/animals/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE animals.id=" + id;
	if ("fields" in req.query)
	{
		query=query.replace("*",req.query["fields"]);
	}
	query +=";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//ANIMAL FILTRE
//PAR CONDITION
app.get( '/animals' , function (req, res) {
	var query = "SELECT * FROM animals" ;
	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;
			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}
		query = query.slice( 0 , -1 );
	}
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//ANIMAL_POST(CREATE)
app.post( '/animals' , function (req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday=req.body.birthday;
	var entry_date=req.body.entry_date;
	var id_cage=req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//ANIMAL_DELETE(DELETE)
app.delete( '/animals' , function (req, res) {
	var query = "DELETE FROM animals" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE animals.id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//ANIMAL_PUT(UPDATE)
app.put( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name" , "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE animals SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE animals.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CAGES

//CAGES_GET(READ)
app.get( '/cages/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE cages.id=" + id;
	if ("fields" in req.query)
	{
		query=query.replace("*",req.query["fields"]);
	}
	query +=";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//CAGES FILTRE
//PAR CONDITION
app.get( '/cages' , function (req, res) {
	var query = "SELECT * FROM cages" ;
	var conditions = [ "name" , "description","area"];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;
			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}
		query = query.slice( 0 , -1 );
	}
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//CAGES_POST(CREATE)
app.post( '/cages' , function (req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES('" + name + "','" + description + "','" + area+ "')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//CAGE_DELETE(DELETE)
app.delete( '/cages' , function (req, res) {
	var query = "DELETE FROM cages" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE cages.id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//CAGE_PUT(UPDATE)
app.put( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name", "description", "area"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE cages SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE cages.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FOOD

//FOOD_GET(READ)
app.get( '/food/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE food.id=" + id;
	if ("fields" in req.query)
	{
		query=query.replace("*",req.query["fields"]);
	}
	query +=";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});
//FILTRE FOOD
//PAR CONDITION
app.get( '/food' , function (req, res) {
	var query = "SELECT * FROM food" ;
	var conditions = [ "name" , "quantity","animal"];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;
			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}
		query = query.slice( 0 , -1 );
	}
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//FOOD_POST(CREATE)
app.post( '/food' , function (req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES('"+ name + "','" + quantity + "','" + id_animal + "')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//FOOD_DELETE(DELETE)
app.delete( '/food' , function (req, res) {
	var query = "DELETE FROM food" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE food.id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//FOOD_PUT(UPDATE)
app.put( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name", "quantity", "id_animal"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE food SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE food.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//STAFF
//STAFF_GET(READ)
app.get( '/staff/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE staff.id=" + id;
	if ("fields" in req.query)
	{
		query=query.replace("*",req.query["fields"]);
	}
	query +=";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});
//FILTRE STAFF
//PAR CONDITION
app.get( '/staff' , function (req, res) {
	var query = "SELECT * FROM staff" ;
	var conditions = [ "firstname" , "lastname","wage"];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;
			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}
		query = query.slice( 0 , -1 );
	}
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//STAFF_POST(CREATE)
app.post( '/staff' , function (req, res) {
	var id = req.body.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES('"+ firstname + "','" + lastname + "','" + wage + "')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//STAFF_DELETE(DELETE)
app.delete( '/staff' , function (req, res) {
	var query = "DELETE FROM staff" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE staff.id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

//STAFF_PUT(UPDATE)
app.put( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "firstname", "lastname", "wage"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE staff SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE staff.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//RELATION

//ANIMAL ET CAGE
app.get( '/animals/:id/cages' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
	var conditions = [ "id","name","description","area"];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

app.get( '/animals/:id/cages/:id_data' , function (req, res) {
var id_user = req.params.id;
var id_data = req.params.id_data;
var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_user + " AND cages.id=" +id_data;
var conditions = [ "id","name","description","area"];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
db.query(query, function (err, result, fields) {
if (err) throw err;
res.send( JSON .stringify(result));
});
});


//CAGE ET ANIMAL
app.get( '/cages/:id/animals' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id; 
	var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//FOOD ET ANIMALS
app.get( '/food/:id/animals' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id=" + id;
	var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

app.get( '/food/:id/animals/:id_data' , function (req, res) {
var id_user = req.params.id;
var id_data = req.params.id_data;
var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id=" + id_user + " AND animals.id=" +id_data;
var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
db.query(query, function (err, result, fields) {
if (err) throw err;
res.send( JSON .stringify(result));
});
});


//FOOD ET ANIMAL
app.get( '/animals/:id/food' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id =food.id_animal WHERE animals.id=" + id;
	var conditions = [ "id","name" , "quantity","id_animal"];
	for ( var index in conditions) {
	if (conditions[index] in req.query) {
	if (query.indexOf( "WHERE" ) < 0 ) {
	query += " WHERE" ;
	} else {
	query += " AND" ;
	}
	query += " " + conditions[index] + "='" +
	req.query[conditions[index]] + "'" ;
	}
	}
	
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FOOD STATS

app.get( '/food-stats/' , function (req, res) {
	
	var query ="SELECT animals.id as id,(food.quantity/animals.food_per_day) as days_left FROM animals INNER JOIN food ON animals.id =food.id_animal" ;
	
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MESSAGE D'INFORMATION
app.listen(3000, function() {
db.connect(function(err) {
if (err) throw err;
console.log('Connection to database successful!');
});
console.log('Example app listening on port 3000!');
});
