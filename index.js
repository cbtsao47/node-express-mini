// implement your API here
const express = require("express");
const server = express();
const db = require("./data/db");
server.use(express.json());
server.use(cors());

const PORT = process.env.PORT || 5000;

server.get("/api/users", (req, res) => {
  db.find()
    .then(resp => res.status(200).json(resp))

    .catch(err =>
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    );
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(resp => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (user.name && user.bio) {
    db.insert(user)
      .then(({ id }) => {
        db.findById(id).then(user => res.status(201).json(user));
      })
      .catch(err =>
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        })
      );
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed" })
    );
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const update = req.body;
  if (id) {
    if (update.name && update.bio) {
      db.update(id, update)
        .then(id => {
          db.findById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
              res
                .status(500)
                .json({ error: "The user information could not be modified." });
            });
        })
        .catch(err =>
          res
            .status(500)
            .json({ error: "The user information could not be modified." })
        );
    } else {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    }
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
});

server.listen(PORT, () => {
  console.log(`\n🔥  Server listening on ${PORT} 🔥\n`);
});
