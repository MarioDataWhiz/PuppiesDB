const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 5010;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Route: Get all puppies
app.get('/puppies', async (req, res) => {
  try {
    const puppies = await prisma.puppies.findMany();
    res.json(puppies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching puppies' });
  }
});

// Route: Get a single puppy by ID
app.get('/puppies/:id', async (req, res) => {
  try {
    const puppy = await prisma.puppies.findUnique({ where: { pet_id: parseInt(req.params.id) } });
    if (!puppy) return res.status(404).json({ error: 'Puppy not found' });
    res.json(puppy);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching puppy' });
  }
});

// Route: Create a new puppy (POST)
app.post('/puppies', async (req, res) => {
  try {
    const { name, breed, age_est, current_kennel_number } = req.body;
    const newPuppy = await prisma.puppies.create({
      data: { name, breed, age_est, current_kennel_number },
    });
    res.status(201).json(newPuppy);  // Return the newly created puppy with 201 status
  } catch (error) {
    res.status(500).json({ error: 'Error creating puppy' });
  }
});

// Route: Update an existing puppy (PUT)
app.put('/puppies/:id', async (req, res) => {
  try {
    const { name, breed, age_est, current_kennel_number } = req.body;
    const updatedPuppy = await prisma.puppies.update({
      where: { pet_id: parseInt(req.params.id) },
      data: { name, breed, age_est, current_kennel_number },
    });
    res.json(updatedPuppy);
  } catch (error) {
    res.status(500).json({ error: 'Error updating puppy' });
  }
});

// Route: Delete a puppy by ID (DELETE)
app.delete('/puppies/:id', async (req, res) => {
  try {
    await prisma.puppies.delete({ where: { pet_id: parseInt(req.params.id) } });
    res.json({ message: 'Puppy deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting puppy' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
