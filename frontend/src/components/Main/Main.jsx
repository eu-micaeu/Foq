import { useEffect, useState } from 'react';
import { getTasks } from '../../utils/api';
import './Main.css';
import { isAuthTokenValid } from '../../utils/cookies';

function Main() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasks = await getTasks();
        setTasks(Array.isArray(tasks) ? tasks : []);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    }
    fetchTasks();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <main>
      {error && <p>{error}</p>}
      <h1>Tasks</h1>
      {isAuthTokenValid() ? (
        <div className="tasks-container">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.task_id} className="task" style={{ backgroundColor: getRandomColor() }}>
                {task.title}
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      ) : (
        <p>Realize o Login!</p>
      )}
    </main>
  );
}

export default Main;
