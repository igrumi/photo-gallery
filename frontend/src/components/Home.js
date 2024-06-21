import React, { useState, useEffect } from 'react';
import API from '../api';
import Header from '../components/Header';
import './Home.css';

const Home = () => {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const fetchMemories = async () => {
      const { data } = await API.get('/memories');
      setMemories(data);
    };

    fetchMemories();
  }, []);

  return (
    <>
      <Header />
      <div className="gallery">
        {memories.map((memory) => (
          <div className="photo" key={memory._id}>
            <img src={memory.imageUrl} alt={memory.title} />
            <div className="overlay">
              <div className="text">
                <h3>{memory.title}</h3>
                <p>{memory.description}</p>
                <p>{new Date(memory.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
