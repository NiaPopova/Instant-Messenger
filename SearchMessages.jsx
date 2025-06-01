import { useState } from 'react';

function SearchMessages() {
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState('all');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}&channel=${channel}`);
    const messages = await response.json();
    setResults(messages);
  };

 const highlightQuery = (text) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, `<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; color: black;">$1</span>`);
};



  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      padding: '40px',
      background: 'linear-gradient(120deg, #e0f7fa, #ffffff)',
      color: '#333',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.2em', color: '#00796b' }}>
        Търсене в съобщения
      </h1>
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Въведи дума за търсене..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="all">Всички канали</option>
          <option value="general">#general</option>
          <option value="dev">#dev</option>
          <option value="random">#random</option>
        </select>
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#81c784',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔍 Търси
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {results.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '18px', color: 'gray' }}>Няма намерени съобщения.</p>
        ) : (
          results.map((msg, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '15px 20px',
              marginBottom: '20px',
              borderLeft: '5px solid #007bff',
              borderRadius: '5px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#00796b' }}>{msg.user}</div>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}
                   dangerouslySetInnerHTML={{ __html: highlightQuery(msg.message) }} />
              <div style={{ fontSize: '12px', color: 'gray' }}>{msg.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchMessages;
