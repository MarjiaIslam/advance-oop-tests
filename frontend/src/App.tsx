import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// 1. Define Interface
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

  // 2. Load Data (GET)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  // 3. Handle Submit (POST / PUT)
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

  // 4. Handle Delete
  const handleDelete = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  };

  // 5. Populate Form for Edit
  const handleEdit = (p: Product) => {
    setForm(p);
    setIsEditing(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Inventory Management</h1>
      
      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>{isEditing ? 'Update Product' : 'Add New Product'}</h3>
        <input 
          placeholder="Name" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={form.price} 
          onChange={e => setForm({...form, price: Number(e.target.value)})} 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={form.quantity} 
          onChange={e => setForm({...form, quantity: Number(e.target.value)})} 
        />
        <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
        {isEditing && <button onClick={() => {setIsEditing(false); setForm({name:'', price:0, quantity:0})}}>Cancel</button>}
      </form>

      {/* LIST */}
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id!)} style={{backgroundColor: 'red', color: 'white'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;