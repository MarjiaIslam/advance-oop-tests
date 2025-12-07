import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ name: '', price: 0, quantity: 0 });
  const [isEditing, setIsEditing] = useState(false);
  
  const API_URL = "/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      await axios.put(`${API_URL}/${form.id}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: '', price: 0, quantity: 0 });
    setIsEditing(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Delete this product?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setForm(p);
    setIsEditing(true);
  };

  // DARK THEME STYLES
  const styles = {
    container: {
      backgroundColor: '#1a1a1a', // Dark Background
      color: '#ffffff',           // White Text
      minHeight: '100vh',         // Full height
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: '#2d2d2d', // Slightly lighter grey for the form
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: '1px solid #444',
      maxWidth: '500px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#4fc3f7', // Light Blue for labels
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      backgroundColor: '#ffffff', // White input background
      color: '#000000',           // Black text inside input
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px'
    },
    buttonPrimary: {
      backgroundColor: '#00e676', // Bright Green
      color: '#000',
      border: 'none',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '6px',
      cursor: 'pointer',
      marginRight: '10px'
    },
    buttonSecondary: {
      backgroundColor: '#ff5252', // Red
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    tableHeader: {
      textAlign: 'left' as const,
      padding: '15px',
      borderBottom: '2px solid #555',
      color: '#4fc3f7'
    },
    tableCell: {
      padding: '15px',
      borderBottom: '1px solid #333'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ borderBottom: '1px solid #444', paddingBottom: '20px' }}>📦 Inventory System</h1>
      
      {/* FORM SECTION */}
      <div style={styles.card}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Name */}
          <div>
            <label style={styles.label}>Product Name:</label>
            <input 
              style={styles.input}
              type="text"
              placeholder="e.g. Samsung TV" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          {/* Price */}
          <div>
            <label style={styles.label}>Price ($):</label>
            <input 
              style={styles.input}
              type="number" 
              placeholder="Enter Price..." 
              value={form.price} 
              onChange={e => setForm({...form, price: Number(e.target.value)})} 
            />
          </div>

          {/* Quantity */}
          <div>
            <label style={styles.label}>Product Number (Quantity):</label>
            <input 
              style={styles.input}
              type="number" 
              placeholder="Enter Quantity..." 
              value={form.quantity} 
              onChange={e => setForm({...form, quantity: Number(e.target.value)})} 
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button type="submit" style={styles.buttonPrimary}>
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
            
            {isEditing && (
              <button 
                type="button" 
                onClick={() => {setIsEditing(false); setForm({name:'', price:0, quantity:0})}}
                style={{ ...styles.buttonPrimary, backgroundColor: '#777', color: 'white' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Product Name</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={styles.tableCell}>{p.name}</td>
              <td style={{ ...styles.tableCell, color: '#00e676' }}>${p.price}</td>
              <td style={styles.tableCell}>{p.quantity}</td>
              <td style={styles.tableCell}>
                <button onClick={() => handleEdit(p)} style={{ ...styles.buttonSecondary, backgroundColor: '#ffa726', marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(p.id!)} style={styles.buttonSecondary}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;