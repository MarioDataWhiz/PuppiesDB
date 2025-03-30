const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const sendEmail = require('./sendgridClient'); 

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


app.post('/puppies', async (req, res) => {
  try {
    const { name, breed, age_est, current_kennel_number } = req.body;
    console.log('Creating puppy with data:', { name, breed, age_est, current_kennel_number });
    
    const newPuppy = await prisma.puppies.create({
      data: { name, breed, age_est, current_kennel_number },
    });

    console.log('Puppy created successfully:', newPuppy);

    // Send email after puppy is added
    try {
      await sendEmail(newPuppy);  // This sends the email using sendGrid
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ error: 'Error sending email' });
    }

    res.status(201).json(newPuppy);  // Return the newly created puppy with 201 status
  } catch (error) {
    console.error('Error creating puppy:', error);  // Log the actual error
    res.status(500).json({ error: 'Error creating puppy' });
  }
});
 

// Create the /sendgrid-events webhook route
app.post('/sendgrid-events', (req, res) => {
  const events = req.body; // The SendGrid event data will be in the body

  // Log the events you receive
  console.log('Received SendGrid event:', events);

  // Loop through each event and log it (you can filter or store it based on your needs)
  events.forEach(event => {
    if (event.event === 'open') {
      console.log(`Email was opened by user: ${event.email}`);
      // You can add more logic to log the open event to your database or file
    }
    // You can handle other event types like 'click', 'bounce', etc.
  });

  // Respond to SendGrid to acknowledge the event receipt
  res.status(200).send('OK');
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
