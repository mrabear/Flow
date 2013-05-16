var entityManager = {
	entities: {},

	entityCount: 0,

	types: {
		ball: "ball",
		boundry: "boundry",
		bumper: "bumper",
		remove: "deleteMe"
	},

	AddEntity: function(type, physicsBody, graphicsDef) {
		var newID = entityManager.entityCount + "";

		physicsBody.userData = newID;
		entityManager.entities[newID] = new entity(entityManager.entityCount + "", type, physicsBody, graphicsDef);

		entityManager.entityCount++;

		return (newID);
	},

	GetEntity: function(id) {
		return (entityManager.entities[id + ""]);
	}

	RemoveEntity: function(id) {
		entityManager.entities[id + ""].type = entityManager.types.remove;
	},

	CleanUpEntities: function() {
		for (var currentEntity in entityManager.entities) {
			if (currentEntity.type == entityManager.types.remove) {
				physics.world.DestroyBody(currentEntity.physicsBody);
				delete(entityManager.entities[id + ""]);
			}
		}
	}
};