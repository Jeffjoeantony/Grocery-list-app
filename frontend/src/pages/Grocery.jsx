import React, { useState } from "react";
import "../styles/grocery.css";
import { addGroceryItem } from "../services/grocery.service";

function Grocery() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  async function handleAdd(event) {
    event.preventDefault();

    if (name.trim().length < 2) {
      alert("Item name must be at least 2 characters");
      return;
    }

    if (!quantity.trim()) {
      alert("Quantity is required");
      return;
    }

    try {
      const data = await addGroceryItem({
        name: name.trim(),
        quantity: quantity.trim(),
        note: note.trim(),
      });

      const newItem = {
        id: data?.[0]?.id ?? Date.now(), 
        name: name.trim(),
        quantity: quantity.trim(),
        note: note.trim(),
        purchased: false,
        createdAt: Date.now(),
      };

      setItems((prev) => [newItem, ...prev]);

      setName("");
      setQuantity("");
      setNote("");
    } catch (err) {
      alert(err.message);
    }
  }

  function togglePurchased(id) {
    setItems((prevItems) =>
      prevItems.map((it) =>
        it.id === id ? { ...it, purchased: !it.purchased } : it
      )
    );
  }

  function removeItem(id) {
    setItems((prevItems) => prevItems.filter((it) => it.id !== id));
  }

  const total = items.length;
  const purchasedCount = items.filter((i) => i.purchased).length;
  const left = total - purchasedCount;

  function formatTime(ms) {
    try {
      return new Date(ms).toLocaleString();
    } catch {
      return "";
    }
  }

  return (
    <div className="grocery-page">
      <div className="grocery-header">
        <div className="grocery-header-inner">
          <h1 className="grocery-title">Grocery List</h1>

          <div className="grocery-stats">
            <span>Total: <strong>{total}</strong></span>
            <span>Purchased: <strong>{purchasedCount}</strong></span>
            <span>Left: <strong>{left}</strong></span>
          </div>
        </div>
      </div>

      <main className="grocery-content">
        <div className="grocery-grid">
          <aside className="add-card">
            <h2 className="card-title">ADD ITEM</h2>

            <form className="add-form" onSubmit={handleAdd}>
              <label className="input-label">
                Name
                <input
                  type="text"
                  value={name}
                  minLength={2}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </label>

              <label className="input-label">
                Quantity
                <input
                  type="text"
                  value={quantity}
                  required
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2 kg / 1 pack"
                />
              </label>

              <label className="input-label">
                Note
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional"
                />
              </label>

              <button className="add-btn" type="submit">
                Add
              </button>
            </form>
          </aside>

          <section className="items-list">
            {items.length === 0 ? (
              <div className="empty">
                No items yet. Add something using the form.
              </div>
            ) : (
              <ul>
                {items.map((it) => (
                  <li
                    key={it.id}
                    className={`item-row ${it.purchased ? "purchased" : ""}`}
                  >
                    <div className="item-main">
                      <div className="item-name">{it.name}</div>
                      {it.quantity && (
                        <div className="item-qty">{it.quantity}</div>
                      )}
                      {it.note && (
                        <div className="item-note">{it.note}</div>
                      )}
                      <div className="item-time">
                        {formatTime(it.createdAt)}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="small-btn"
                        onClick={() => togglePurchased(it.id)}
                      >
                        {it.purchased ? "Undo" : "Purchased"}
                      </button>
                      <button
                        className="small-btn danger"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Grocery;
