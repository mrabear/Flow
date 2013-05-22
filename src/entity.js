// src.entity.js

// Class: entity
// Entities are the parent container for all game objects they combine the physics and graphics components together
// to make coordination between them much easier

function entity(id, type, physicsBody, graphicsDef) {
	this.id = id;
	this.type = type;
	this.physicsBody = physicsBody;
	this.graphicsDef = graphicsDef;
};

// Helper Class: entityManager
// Manages all of the active entries and has methods for working with entities
var entityManager = {
	// The list of all entities
	entities: {},

	// The total entity count (used to make unique entity IDs)
	entityCount: 0,

	// The list of all valid entity types
	types: {
		ball: "ball",
		boundary: "boundary",
		bumper: "bumper",
		remove: "deleteMe"
	},

	// Adds an entity to the active list, returns the ID of the newly created entity
	AddEntity: function(type, physicsBody, graphicsDef) {
		// Create the new entity ID
		var newID = entityManager.entityCount + "";

		// Update the physics and graphics objects with the new ID
		// This is a very important step and links the individual objects back to the associated entity
		if (physicsBody != null) physicsBody.SetUserData(newID);
		if (graphicsDef != null) graphicsDef.id = newID;

		// Add the entity to the active list
		entityManager.entities[newID] = new entity(newID, type, physicsBody, graphicsDef);

		// Increment the entity count to insure that the next entity is unique
		entityManager.entityCount++;

		// Returns the new entity ID
		return (newID);
	},

	// Returns the entity with the given ID
	GetEntity: function(id) {
		return (entityManager.entities[id + ""]);
	},

	// Schedules the given entity for deletion 
	// Deletion doesn't happen until CleanUpEntities is called because the physics engine locks objects out during simulations
	RemoveEntity: function(id) {
		entityManager.entities[id + ""].type = entityManager.types.remove;
	},

	// Delete all entities that were previuosly scheduled for deletion (by having the type set to 'remove')
	CleanUpEntities: function() {
		// Loop through all entities
		for (var currentEntity in entityManager.entities) {
			// If the current entity has been marked for deletion
			if (entityManager.GetEntity(currentEntity).type == entityManager.types.remove) {
				// Destroy the physics body from the simulation world 
				physics.world.DestroyBody(entityManager.GetEntity(currentEntity).physicsBody);

				// Delete the entity
				delete(entityManager.entities[currentEntity]);
			}
		}
	},

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateEntityPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var entityCanvasPosition = {};

		// Loop through each ball and update it's position
		for (var currentEntity in entityManager.entities) {
			// Translate the ball positions
			if (entityManager.GetEntity(currentEntity).type == entityManager.types.ball) {
				entityCanvasPosition = physics.GetBodyCanvasPosition(entityManager.GetEntity(currentEntity).physicsBody);

				// If the ball is past the center X point, translate X position by XOffset
				if (entityCanvasPosition.x > graphics.centerPoint.x) entityCanvasPosition.x += XOffset;

				// If the ball is past the center Y point, translate Y position by YOffset
				if (entityCanvasPosition.y > graphics.centerPoint.y) entityCanvasPosition.y += YOffset;

				// Update the ball location
				physics.SetBodyCanvasPosition(entityManager.GetEntity(currentEntity).physicsBody, entityCanvasPosition);

				// Recreate the sensor boundaries
			} else if (entityManager.GetEntity(currentEntity).type == entityManager.types.boundary) {
				entityManager.RemoveEntity(currentEntity);
				physics.SetupBoundarySensors();
			}
		}
	}
};