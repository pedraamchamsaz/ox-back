const { Event } = require("../models/events");
const { Users } = require("../models/users")



exports.getAllEvents = async function (req, res) {
  try {
      const { tag } = req.query;
      let query = {}; 

      if (tag) {
          query = { tags: tag };
      }

      const events = await Event.find(query);

      res.send(events);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).send({ message: "Error fetching events." });
  }
};





exports.getSingleEvent = async function (req, res) {
  try {
    const eventId = req.params.eventid
    const singleEvent = await Event.findById(eventId)
    res.send(singleEvent)

  } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).send({ message: "Error fetching event." });
  }
}




exports.createEvent = async function (req, res) {
   try { 
    const newEvent = req.body;

    // Retrieve the user's token from the authorization header
    const authHeader = req.headers["authorization"];
   
    
      // Find the user based on the token
      const user = await Users.findOne({ token: authHeader });
  
      // Check if the user exists
      if (!user) {
        return res.sendStatus(403); // Forbidden if user not found
      }
  
     
    //   // Create a new event document and associate it with the user
      const event = new Event({
        ...newEvent,
        createdBy: user._id, // Assign the user's ID to the createdBy field
      });
  
      // Save the event
      await event.save();
  
      res.send({ message: "New event inserted." });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).send({ message: "Error creating event.", error });
    }
  };


 
    exports.getUserEvents = async function (req, res) { 
    try {
      // Retrieve the user's token from the authorization header
      const authHeader = req.headers["authorization"];
     
      // Find the user based on the token
      const user = await Users.findOne({ token: authHeader });
      console.log(user)
  
      // Check if the user exists
      if (!user) {
        return res.sendStatus(403); // Forbidden if user not found
      }
  
      // Find events created by the user
      const userEvents = await Event.find({ createdBy: user._id });
  
      res.send(userEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).send({ message: "Error fetching user events." });
    }
  };
 


  // Update event
  exports.updateUserEvents = async function (req, res) {
// app.put("/:id", async (req, res) => {
  try {
    // Retrieve the user's token from the authorization header
    const authHeader = req.headers["authorization"];

    // Find the user based on the token
    const user = await Users.findOne({ token: authHeader });

    // Check if the user exists
    if (!user) {
      return res.sendStatus(403); // Forbidden if user not found
    }

    // Find the event by ID
    const event = await Event.findById(req.params.id);

    // Check if the event exists
    if (!event) {
      return res.status(404).send({ message: "Event not found." });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this event." });
    }

    // Update the event
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.send({ message: "Event updated." });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).send({ message: "Error updating event." });
  }
};

// Delete event
exports.deleteUserEvents = async function (req, res) {
// app.delete("/:id", async (req, res) => {
  try {
    // Retrieve the user's token from the authorization header
    const authHeader = req.headers["authorization"];

    // Find the user based on the token
    const user = await Users.findOne({ token: authHeader });

    // Check if the user exists
    if (!user) {
      return res.sendStatus(403); // Forbidden if user not found
    }

    // Find the event by ID
    const event = await Event.findById(req.params.id);

    // Check if the event exists
    if (!event) {
      return res.status(404).send({ message: "Event not found." });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this event." });
    }

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);
    res.send({ message: "Event deleted." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send({ message: "Error deleting event." });
  }
};







