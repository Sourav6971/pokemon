import React, { useState, useEffect } from "react";

const Gaming = () => {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState(Array(16).fill(false));
  const [lockedTiles, setLockedTiles] = useState(Array(16).fill(false));
  const [firstTile, setFirstTile] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_tiles");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      let shuffled = data
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      setTiles(shuffled);
      resetGame();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const resetGame = () => {
    setFlipped(Array(16).fill(false));
    setLockedTiles(Array(16).fill(false));
    setFirstTile(null);
    setClickCount(0);
  };

  const handleClick = (index) => {
    if (!flipped[index] && !lockedTiles[index]) {
      const newFlipped = [...flipped];
      newFlipped[index] = true;
      setFlipped(newFlipped);

      const currentTileNumber = tiles[index].tile_number;
      setClickCount((prevCount) => prevCount + 1);

      if (firstTile === null) {
        setFirstTile({ index, tileNumber: currentTileNumber });
      } else {
        const firstTileNumber = firstTile.tileNumber;
        const firstTileIndex = firstTile.index;

        const newLockedTiles = [...lockedTiles];

        if (
          (firstTileNumber === currentTileNumber - 1 &&
            firstTileNumber % 2 !== 0) ||
          (firstTileNumber === currentTileNumber + 1 &&
            currentTileNumber % 2 !== 0)
        ) {
          newLockedTiles[firstTileIndex] = true;
          newLockedTiles[index] = true;
          setLockedTiles(newLockedTiles);
        }

        setFirstTile(null);

        setTimeout(() => {
          setFlipped(newLockedTiles);
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {tiles.length === 0 ? (
          <div className="text-center text-xl">Loading tiles...</div>
        ) : (
          tiles.map((tile, index) => (
            <div
              key={index}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer"
              onClick={() => handleClick(index)}
            >
              <div
                className={`flip-container ${flipped[index] ? "flipped" : ""}`}
              >
                <div className="front bg-pink-500 rounded-lg flex items-center justify-center"></div>
                <div className="back bg-gray-200 rounded-lg flex items-center justify-center">
                  <img
                    src={tile.file_name}
                    alt={`Tile ${index + 1}`}
                    className="object-cover w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg"
                    style={{ aspectRatio: "1/1" }}
                    onError={() =>
                      console.error(`Failed to load image: ${tile.file_name}`)
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col items-center mt-4">
        <div className="bg-pink-500 text-white p-2 rounded font-sans text-lg">
          Click Count: {clickCount}
        </div>
        <button
          onClick={fetchTiles}
          className="bg-blue-500 text-white p-2 rounded font-sans text-lg mt-2 hover:bg-blue-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Gaming;
