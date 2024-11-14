import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Grid, 
  TablePagination, 
  TableSortLabel, 
  Typography 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';


const API_BASE_URL = 'https://contact-management-y426.onrender.com'; 

function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: ''
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

 
  useEffect(() => {
    fetchContacts();
  }, []);

  
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  
  const validatePhoneNumber = (phone) => {
    const regex = /^[0-9]+$/;  
    return regex.test(phone);
  };

  
  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.company || !form.jobTitle) {
      alert('Please fill in all fields');
      return;
    }

    
    if (!validateEmail(form.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    
    if (!validatePhoneNumber(form.phone)) {
      setPhoneError('Phone number must be numeric.');
      return;
    } else {
      setPhoneError('');
    }

    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/contacts/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/contacts`, form);
      }
      setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '' });
      fetchContacts();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === 'Contact with this email already exists') {
          setEmailError('This email is already used by another contact.');
        } else {
          alert(error.response.data.message);  
        }
      }
    }
  };

 
  const handleEdit = (contact) => {
    setEditId(contact._id);
    setForm(contact);
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  
  const sortedContacts = (contacts) => {
    const comparator = (a, b) => {
      if (orderBy === 'firstName') {
        return (a.firstName < b.firstName ? -1 : 1);
      }
      
      return 0;
    };

    return order === 'desc' ? contacts.sort(comparator).reverse() : contacts.sort(comparator);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'Poppins' }}>
     
      <div style={{ width: '33%', padding: '1rem' }}>
       
        <Typography variant="h5" style={{ color: '#181c39', marginBottom: '1rem' }}>Contact Form</Typography>
        <Grid container spacing={2} component="form">
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              error={emailError !== ''}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              error={phoneError !== ''}
              helperText={phoneError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Job Title"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ backgroundColor: '#5869fc' }}>
              {editId ? 'Update Contact' : 'Add Contact'}
            </Button>
          </Grid>
        </Grid>
      </div>

      
      <div style={{ width: '66%', padding: '1rem' }}>
        <Typography variant="h5" style={{ color: '#181c39', marginBottom: '1rem' }}>Contacts Table</Typography>
        <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'firstName'}
                    direction={orderBy === 'firstName' ? order : 'asc'}
                    onClick={() => handleRequestSort('firstName')}
                  >
                    First Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedContacts(contacts).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(contact)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(contact._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default ContactManager;
