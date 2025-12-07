import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Product {
  id?: number;
  name: string;
  price: string; 
  quantity: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

 
  const API_URL = "https://stunning-space-waffle-jj74rw456qxgfqxr7-8080.app.github.dev/api/products"; 

  // Load Data
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      // Convert numbers to strings for display consistency if needed
      setProducts(res.data);
    } catch (error) {
      console.error("Error connecting to Backend. CHECK API_URL!", error);
      alert("Error: Could not connect to backend. Check Console (F12) and API_URL.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data (Convert strings back to numbers for backend)
    const payload = {
      name: name,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      // Reset Form
      setName('');
      setPrice('');
      setQuantity('');
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error Saving:", error);
      alert("Failed to save. Is the backend running?");
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error Deleting:", error);
    }
  };

  const handleEdit = (p: Product) => {
    setName(p.name);
    setPrice(String(p.price));
    setQuantity(String(p.quantity));
    setEditingId(p.id!);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", borderBottom: "2px solid #E6E6FA", paddingBottom: "10px" }}>
        Inventory Management System
      </h1>

      {/* --- FORM SECTION --- */}
      <div style={{ 
        backgroundColor: "#1a1a1a", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "30px",
        border: "1px solid #333" 
      }}>
        <h3 style={{ marginTop: 0 }}>
          {editingId ? "✏️ Update Item" : "➕ Add New Item"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <label>Product Name</label>
          <input 
            type="text" 
            placeholder="Enter product name (e.g. Laptop)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              {/* Price */}
              <label>Price ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* Quantity */}
              <label>Quantity</label>
              <input 
                type="number" 
                placeholder="0" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%" }}>
            {editingId ? "Update Product" : "Save Product"}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); setName(''); setPrice(''); setQuantity(''); }}
              style={{ width: "100%", marginTop: "10px", backgroundColor: "#333", color: "white" }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* --- TABLE SECTION --- */}
      <div>
        <h3>📦 Current Inventory</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#ddd" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E6E6FA", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Product Name</th>
              <th style={{ padding: "10px" }}>Price</th>
              <th style={{ padding: "10px" }}>Quantity</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No products found. Add one above!
                </td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "15px 10px", fontWeight: "bold", color: "#E6E6FA" }}>{p.name}</td>
                <td style={{ padding: "10px" }}>${p.price}</td>
                <td style={{ padding: "10px" }}>{p.quantity}</td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: "10px", backgroundColor: "#444", color: "white" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id!)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;