import React, { useState } from "react";
import "../styles/grocery.css";

/*
  Beginner-friendly Grocery component with created time shown for each item.
  - When an item is added we store createdAt as a timestamp (ms).
  - We format createdAt using toLocaleString() when rendering.
*/

function Grocery() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  function handleAdd(event) {
    event.preventDefault();

    if (name.trim() === "") {
      alert("Please enter an item name.");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: name.trim(),
      quantity: quantity.trim(),
      note: note.trim(),
      purchased: false,
      createdAt: Date.now(), // store creation time (ms since epoch)
    };

    // newest first
    setItems(function (prevItems) {
      return [newItem].concat(prevItems);
    });

    setName("");
    setQuantity("");
    setNote("");
  }

  function togglePurchased(id) {
    setItems(function (prevItems) {
      return prevItems.map(function (it) {
        if (it.id === id) {
          return { ...it, purchased: !it.purchased };
        }
        return it;
      });
    });
  }

  function removeItem(id) {
    setItems(function (prevItems) {
      return prevItems.filter(function (it) {
        return it.id !== id;
      });
    });
  }

  var total = items.length;
  var purchasedCount = items.filter(function (i) {
    return i.purchased;
  }).length;
  var left = total - purchasedCount;

  function formatTime(ms) {
    try {
      return new Date(ms).toLocaleString(); 
    } catch (e) {
      return "";
    }
  }

  return (
    <div className="grocery-page">
      <div className="grocery-header">
        <div className="grocery-header-inner">
          <div className="header-left" aria-hidden="true" />
          <h1 className="grocery-title">Grocery List</h1>

          <div className="grocery-stats" aria-label="Grocery stats">
            <span className="stat">Total: <strong>{total}</strong></span>
            <span className="stat">Purchased: <strong>{purchasedCount}</strong></span>
            <span className="stat">Left: <strong>{left}</strong></span>
          </div>
        </div>
      </div>

      <main className="grocery-content">
        <div className="grocery-grid">
          <aside className="add-card" aria-label="Add item">
            <h2 className="card-title">ADD ITEM</h2>
            <form className="add-form" onSubmit={handleAdd}>
              <label className="input-label">
                Name
                <input
                  type="text"
                  value={name}
                  minLength={2}
                  onChange={function (e) { setName(e.target.value); }}
                  placeholder="Item name"
                />
              </label>

              <label className="input-label">
                Quantity
                <input
                  type="text"
                  value={quantity}
                  required
                  onChange={function (e) { setQuantity(e.target.value); }}
                  placeholder="e.g. 2 kg / 1 pack"
                />
              </label>

              <label className="input-label">
                Note
                <input
                  type="text"
                  value={note}
                  onChange={function (e) { setNote(e.target.value); }}
                  placeholder="Optional note"
                />
              </label>

              <button className="add-btn" type="submit">Add</button>
            </form>
          </aside>

          <section className="items-list" aria-label="Items list">
            {items.length === 0 ? (
              <div className="empty">No items yet. Add something using the form.</div>
            ) : (
              <ul>
                {items.map(function (it) {
                  return (
                    <li key={it.id} className={it.purchased ? "item-row purchased" : "item-row"}>
                      <div className="item-main">
                        <div className="item-name">{it.name}</div>


                        {it.quantity && <div className="item-qty">{it.quantity}</div>}
                        {it.note && <div className="item-note">{it.note}</div>}
                        <div className="item-time">{formatTime(it.createdAt)}</div>
                      </div>

                      <div className="item-actions">
                        <button className="small-btn" onClick={function () { togglePurchased(it.id); }}>
                          {it.purchased ? "Undo" : "Purchased"}
                        </button>
                        <button className="small-btn danger" onClick={function () { removeItem(it.id); }}>
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Grocery;