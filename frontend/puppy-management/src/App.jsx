import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const App = () => {
  const [puppies, setPuppies] = useState([]);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [ageEst, setAgeEst] = useState('');
  const [kennelNumber, setKennelNumber] = useState('');
  const [editingId, setEditingId] = useState(null);

  const apiUrl = 'http://localhost:5010/puppies'; // Your backend API URL

  // Fetch puppies from backend
  const fetchPuppies = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPuppies(response.data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  useEffect(() => {
    fetchPuppies(); // Fetch puppies when the component mounts
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert age_est and current_kennel_number to integers (if they're strings)
    const ageEstInt = parseInt(ageEst, 10);  // Converts to integer
    const kennelNumInt = parseInt(kennelNumber, 10);  // Converts to integer

    // Check if conversion failed (NaN), and handle the case if needed
    if (isNaN(ageEstInt) || isNaN(kennelNumInt)) {
      console.error('Age or kennel number is invalid');
      return;  // Optionally, you can display a message to the user
    }

    if (editingId) {
      // Update existing puppy
      try {
        const response = await axios.put(`${apiUrl}/${editingId}`, {
          name,
          breed,
          age_est: ageEstInt,
          current_kennel_number: kennelNumInt,
        });
        setEditingId(null); // Reset edit mode
        fetchPuppies(); // Refresh the puppy list
        clearForm(); // Clear the form
      } catch (error) {
        console.error('Error updating puppy:', error);
      }
    } else {
      // Add new puppy
      try {
        const response = await axios.post(apiUrl, {
          name,
          breed,
          age_est: ageEstInt,
          current_kennel_number: kennelNumInt,
        });
        fetchPuppies(); // Refresh the puppy list
        clearForm(); // Clear the form
      } catch (error) {
        console.error('Error creating puppy:', error);
      }
    }
  };
  
  // Handle delete puppy
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchPuppies(); // Refresh the puppy list
    } catch (error) {
      console.error('Error deleting puppy:', error);
    }
  };

  // Handle edit puppy
  const handleEdit = (puppy) => {
    setName(puppy.name);
    setBreed(puppy.breed);
    setAgeEst(puppy.age_est);
    setKennelNumber(puppy.current_kennel_number);
    setEditingId(puppy.pet_id);
  };

  // Clear the form
  const clearForm = () => {
    setName('');
    setBreed('');
    setAgeEst('');
    setKennelNumber('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Puppy Management</h1>

      {/* Form to add/edit puppy */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Age Estimate"
          value={ageEst}
          onChange={(e) => setAgeEst(e.target.value)}
          type="number"
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Kennel Number"
          value={kennelNumber}
          onChange={(e) => setKennelNumber(e.target.value)}
          type="number"
          style={{ marginBottom: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingId ? 'Update Puppy' : 'Add Puppy'}
        </Button>
      </form>

      {/* Table to display puppies */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Age Estimate</TableCell>
              <TableCell>Kennel Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puppies.map((puppy) => (
              <TableRow key={puppy.pet_id}>
                <TableCell>{puppy.name}</TableCell>
                <TableCell>{puppy.breed}</TableCell>
                <TableCell>{puppy.age_est}</TableCell>
                <TableCell>{puppy.current_kennel_number}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(puppy)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(puppy.pet_id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
