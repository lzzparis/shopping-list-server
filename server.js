var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
	add: function(name, id) {
		var item;
		if(id==null) {
			item = {name: name, id: this.setId};
		}
		else{
			item = {name: name, id: id};
		}
		this.items.push(item);
		this.setId += 1; 
		return item;
	},
	remove: function(id) {
		var targetIndex = null;
		this.items.forEach(function(item, i){
			if(item.id == id){
				targetIndex = i;
			}
		});
		if(targetIndex === null){
			return false;
		}
		else{
			this.items.splice(targetIndex, 1);
			return true;
		}
	},
	update: function(name, id){
		var targetIndex = null;
		this.items.forEach(function(item, i){
			if(item.id == id){
				targetIndex = i;
			}
		});
		if(targetIndex === null){
			return this.add(name, id);	
		}
		else{
			this.items[targetIndex].name = name;
			return this.items[targetIndex];
		}
		
	}
};


var createStorage = function() {
	var storage = Object.create(Storage);
	storage.items = [];
	storage.setId = 0;
	return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
	response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response){
	if (!('name' in request.body)){
		return response.sendStatus(400);
	}

	var item = storage.add(request.body.name);
	response.status(201).json(item);	
	
});

app.delete('/items/:id', function(request, response){
	var id = parseFloat(request.params.id);
	var success = storage.remove(id);	
	if(!success){
		return response.status(404).json({status:"ERROR"});
	}

	response.sendStatus(200);	

});

app.put('/items/:id', jsonParser, function(request, response){
	var id = parseFloat(request.params.id);
	if(!('id' in request.body) || !('name' in request.body) || (id == undefined)){
		return response.status(404).json({message:"bad request"});
	}
	else if (request.body.id != id){
		//request ID wins if not the same as endpoint ID
		id = request.body.id;
	}
	var name = request.body.name;
	var item = storage.update(name,id);
	response.status(200).json(item);

});

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;
