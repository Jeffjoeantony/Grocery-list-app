import React, { useEffect, useState } from "react";
import "../styles/grocery.css";
import { fetchGroceryItems, addGroceryItem, togglePurchased, deleteGroceryItem } from "../services/grocery.service";

function Grocery() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await fetchGroceryItems();
      setItems(data);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();

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

      if (!data || !data.length) {
        throw new Error("Insert failed");
      }
      
      setItems((prev) => [data[0], ...prev]);
      

      setName("");
      setQuantity("");
      setNote("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggle(item) {
    try {
      await togglePurchased(item.id, item.purchased);

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, purchased: !it.purchased }
            : it
        )
      );
    } catch (err) {
      alert("Failed to update item");
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteGroceryItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const total = items.length;
  const purchasedCount = items.filter((i) => i.purchased).length;
  const left = total - purchasedCount;

  function formatTime(ts) {
    try {
      return new Date(ts).toLocaleString();
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
              <div className="empty">No items yet.</div>
            ) : (
              <ul>
                {items.map((it) => (
                  <li
                    key={it.id}
                    className={`item-row ${it.purchased ? "purchased" : ""}`}
                  >
                    <div className="item-main">
                      <div className="item-name">{it.name}</div>
                      <div className="item-qty">{it.quantity}</div>
                      {it.note && <div className="item-note">{it.note}</div>}
                      <div className="item-time">
                        {formatTime(it.created_at)}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="small-btn"
                        onClick={() => handleToggle(it)}
                      >
                        {it.purchased ? "Undo" : "Purchased"}
                      </button>

                      <button
                        className="small-btn danger"
                        onClick={() => handleDelete(it.id)}
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
