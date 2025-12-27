import React, {useState} from 'react';
import ThemePicker from './ThemePicker';

export default function AutoDashboardControls({preview, onResult}) {
  const [theme, setTheme] = useState('minimal_white');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auto-dashboard', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ preview, theme_id: theme })
      });
      const data = await res.json();
      onResult(data);
    } catch(err) {
      console.error(err);
      alert('Generation failed: '+err.message)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h3>Choose theme</h3>
      <ThemePicker onSelect={(id)=>setTheme(id)} />
      <div className="mt-4">
        <button onClick={generate} className="bg-emerald px-4 py-2 rounded">{loading? 'Generating...':'Generate Dashboard'}</button>
      </div>
    </div>
  )
}
