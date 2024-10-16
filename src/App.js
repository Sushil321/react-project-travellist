import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: true },
//   { id: 2, description: "Socks", quantity: 12, packed: true },
// ];

export default function App() {
  const [items , setItems] = useState([]);

  function handleAddItems(item){
    setItems(items=>[...items , item]);

  }

  function handlePacked(id){
    setItems(items=>items.map(item=>item.id === id ? {...item , packed : !item.packed } : item))

  }

  function handleDelete(id){
    setItems(items=>items.filter(item=>item.id !== id));
  }

  function handleClearAll(){
    const confirmed = window.confirm("Are you sure you wanna delete everything??");
    if(confirmed) setItems([]);
  }

  return (
    <div>
      <Logo />
      <Form onAddItems={handleAddItems}/>
      <PackingList items={items} onDeteItem = {handleDelete} onPackedItem={handlePacked} onClear = {handleClearAll}/>
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🏝️far Away</h1>;
}

function Form({onAddItems}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  

  function handleSubmit(e) {

    if(!description) return;

    e.preventDefault();
    const newItem = {description , quantity , packed:false , id : Date.now()};
    console.log(newItem);

    onAddItems(newItem);

    
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Items"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({items , onDeteItem , onPackedItem ,onClear }) {
  const [sortBy , setSortBy] = useState("input");
  let sortedItems = items; 
  
  if(sortBy === "input") sortedItems = items;

  if(sortBy === "description") sortedItems = items.slice().sort((a,b)=>a.description.localeCompare(b.description));

  if(sortBy === "packedstatus") sortedItems = items.slice().sort((a,b)=>Number(a.packed)-Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item item={item} key={item.id} onDeteItem={onDeteItem} onPackedItem = {onPackedItem}/>
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="input">sort by input</option>
          <option value="description">sort by description</option>
          <option value="packedstatus">sort by packedstatus</option>
        </select>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}

function Item({ item , onDeteItem , onPackedItem }) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={()=>onPackedItem(item.id)}/>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}{" "}
      </span>
      <button onClick={()=>onDeteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({items}) {
  if(!items.length) return <p className="stats"><em>Start adding Items in your list 🚀</em></p>
  const numItem = items.length;
  const packedItem = items.filter(item=>item.packed).length;
  const percentage  = Math.round((packedItem/numItem) *100);
  
  return (
   
    <footer className="stats">

      <em>
        {
            percentage === 100 ? "You are ready to go✈️" : 
          `You have ${numItem} items in your list and you have packed ${packedItem}(${percentage}%)`
        }
      </em>
    </footer>
  );
}
