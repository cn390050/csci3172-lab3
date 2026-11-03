import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetch('http://localhost:3000/api/players')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }

        return response.json();
      })
      .then(data => {
        setPlayers(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // returns player matching search input and filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = position === 'All' || player.position === position;

    return matchesSearch && matchesPosition;
  });

  // sorts players in asc or desc order
  const sortedPlayers = filteredPlayers.sort((a, b) => {
    if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
    }

    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  // handles click for table headings
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="container py-5">
      <header className="mb-5">
        <h2 className="fw-bold">PUCKSTATS</h2>
        <p className="text-muted">NHL Player Statistics</p>
      </header>

      <section>
        <h3 className="fw-bold mb-4">Player Statistics</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
                type="text"
                className="form-control"
                placeholder="Search players..."
                value={search}
                onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
                className="form-select"
                value={position}
                onChange={event => setPosition(event.target.value)}
            >
                <option value="All">All Positions</option>
                <option value="C">Center</option>
                <option value="LW">Left Wing</option>
                <option value="RW">Right Wing</option>
                <option value="D">Defense</option>
                <option value="G">Goalie</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                {[
                  ['name', 'Player'],
                  ['team', 'Team'],
                  ['position', 'Position'],
                  ['games', 'GP'],
                  ['goals', 'G'],
                  ['assists', 'A'],
                  ['points', 'PTS']
                ].map(([column, label]) => (
                  <th
                      key={column}
                      onClick={() => handleSort(column)}
                      style={{ cursor: 'pointer' }}
                  >
                      {label} {sortBy === column ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedPlayers.map(player => (
                <tr key={player.id}>
                  <td className="fw-semibold">{player.name}</td>
                  <td>{player.team}</td>
                  <td>{player.position}</td>
                  <td>{player.games}</td>
                  <td>{player.goals}</td>
                  <td>{player.assists}</td>
                  <td className="fw-bold">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedPlayers.length === 0 && (
              <p className="text-muted text-center py-4">
                  No players found.
              </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;