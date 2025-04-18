"use client";
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function CounterApp() {
  const [categories, setCategories] = useState({});
  const [selected, setSelected] = useState('');
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch('/api/counter', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        setSelected(Object.keys(data)[0] || '');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Save categories to backend
  async function saveCategories(newCategories) {
    setCategories(newCategories);
    await fetch('/api/counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ categories: newCategories })
    });
  }

  // Make sure your event handlers are properly defined
  function addCategory(e) {
    e.preventDefault(); // Prevent default form submission
    if (!newCat) return;
    const now = new Date();
    const update_time = now.toISOString();
    const newCategories = {
      ...categories,
      [newCat]: {
        value: 0,
        last_updated: update_time,
        clicks_today: 0,
        last_click_date: update_time.split('T')[0]
      }
    };
    saveCategories(newCategories);
    setNewCat('');
    setSelected(newCat);
  }

  function deleteCategory() {
    if (!selected) return;
    const newCategories = { ...categories };
    delete newCategories[selected];
    saveCategories(newCategories);
    setSelected(Object.keys(newCategories)[0] || '');
  }

  function updateCategoryValue(delta) {
    if (!selected) return;
    const now = new Date();
    const cat = categories[selected];
    const today = now.toISOString().split('T')[0];
    const isToday = cat.last_click_date === today;
    const clicks_today = isToday ? cat.clicks_today + 1 : 1;
    const newCat = {
      ...cat,
      value: (cat.value || 0) + delta,
      last_updated: now.toISOString(),
      clicks_today,
      last_click_date: today
    };
    const newCategories = { ...categories, [selected]: newCat };
    saveCategories(newCategories);
  }

  function resetCategory() {
    if (!selected) return;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const newCat = {
      ...categories[selected],
      value: 0,
      last_updated: now.toISOString(),
      clicks_today: 0,
      last_click_date: today
    };
    const newCategories = { ...categories, [selected]: newCat };
    saveCategories(newCategories);
  }

  // Responsive and dark/light mode styles are handled globally

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="counter-app">
      <ThemeToggle />
      <div className="top-section">
        <input
          type="text"
          placeholder="New Category"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          className="colorful-input"
        />
        <button type="button" onClick={addCategory} className="add-btn">Add</button>
        <button type="button" onClick={deleteCategory} disabled={!selected} className="delete-btn">Delete</button>
      </div>
      <div className="middle-section">
        <select 
          value={selected} 
          onChange={e => setSelected(e.target.value)}
          className="colorful-select"
        >
          {Object.keys(categories).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={() => updateCategoryValue(1)} className="increment-btn">Increment</button>
        <button onClick={() => updateCategoryValue(0.5)} className="increment-half-btn">Increment 0.5</button>
        <button onClick={() => updateCategoryValue(-1)} disabled={!selected} className="decrement-btn">Decrement</button>
        <button onClick={() => updateCategoryValue(-0.5)} disabled={!selected} className="decrement-half-btn">Decrement 0.5</button>
        <button onClick={resetCategory} disabled={!selected} className="reset-btn">Reset</button>
      </div>
      <div className="value-label">
        {selected && (
          <span>
            Current Value for <br></br><span className="highlight-text">{selected}</span> : 
            <span className="value-number">{categories[selected]?.value || 0}</span>
          </span>
        )}
      </div>
      <div className="table-container">
        <div className="table-section">
          <table className="colorful-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
                <th>Last Updated</th>
                <th>Added Today</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categories).map(([cat, data]) => (
                <tr key={cat} className={cat === selected ? 'selected' : ''}>
                  <td>{cat}</td>
                  <td className="value-cell">{data.value}</td>
                  <td>{new Date(data.last_updated).toLocaleString()}</td>
                  <td className="today-cell">{data.clicks_today}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .counter-app { 
          max-width: 800px; 
          margin: 2rem auto; 
          padding: 2rem; 
          background: var(--bg); 
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(42, 51, 79, 0.5);
          border: 1px solid var(--border);
        }
        .top-section, .middle-section { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 0.5rem; 
          margin-bottom: 1rem; 
        }

        .colorful-select{
            text-align: center;
    color: #ffffff;
    background-color: #6d519b94;
    border-radius: 12px;
    width: 90%;
    margin: 10px auto;
    padding: .5rem;
    display: block;
        }


        
        /* Updated button styles with increased padding and rounded borders */
        button {
          padding: 0.9rem 0.9rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .value-label { 
          margin: 1.5rem 0; 
          font-weight: bold;
          font-size: 1.2rem;
          padding: 1rem;
          background: linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1));
          border-radius: 8px;
          text-align: center;
        }
        .highlight-text {
          color: #6366F1;
          font-weight: bold;
          margin-left:5px;
        }
        .value-number {
          font-size: 1.4rem;
          margin-left: 0.5rem;
          color: #8B5CF6;
          font-weight: bold;
          padding: 5px;
        }
        .colorful-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          text-align:center;
        }
        th {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          color: white;
          padding: 1rem;
          font-weight: 600;
        }
        td {
          padding: 0.8rem;
          border-bottom: 1px solid var(--border);
        }
        .value-cell {
          font-weight: bold;
          color: #6366F1;
        }
        .today-cell {
          font-weight: bold;
          color: #8B5CF6;
        }
        tr.selected { 
          background: linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1));
        }
        .add-btn { background: #10B981; }
        .delete-btn { background: #EF4444; }
        .increment-btn { background: #6366F1; }
        .increment-half-btn { background: #818CF8; }
        .decrement-btn { background: #F43F5E; }
        .decrement-half-btn { background: #FB7185; }
        .reset-btn { background: #F59E0B; }
        
        @media (max-width: 767px) {
          .counter-app { padding: 0.1rem; }
          .table-container {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--border);
          }
        @media (max-width: 360px) {
          .counter-app { padding: 5px;
          }

          .table-container {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--border);
          }
            button {
          padding: 0.4rem 0.4rem;
          font-weight: 300;
          font-size:12px;
        }
          .colorful-table{
            width:100%;
          }
          th {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          color: white;
          padding: .7rem;
          font-weight: 300;
        }
        td {
          padding: 0.6rem;
          border-bottom: 1px solid var(--border);
        }
        .value-cell {
          font-weight: normal;
          color: #6366F1;
          font-size:12px;
        }
      }
      `}</style>
    </div>
  );
}