import React, { useCallback, useRef, useState } from 'react'

import produce from 'immer';

const numRows = 50;
const numCols = 100;
const randomSparsity = 0.7;

const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [1, 0],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let index = 0; index < numRows; index++) {
    rows.push(Array(numCols).fill(0))
  }
  return rows
}


const App = () => {
  const [grid, setGrid] = useState(generateEmptyGrid())
  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            })
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            }
            else if (neighbors === 3 && g[i][j] === 0) {
              gridCopy[i][j] = 1;
            }
          }
        }
      }
      )
    }
    )
    setTimeout(runSimulation, 100);
  },
    [],
  )
  return (
    <>
      <div style={{
        margin: "auto",
        display: "table"
      }}>

        <button onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }
        }
          style={{
            marginLeft: "50%",
            marginTop: "20px",
            marginBottom: "20px"
          }}>
          {running ? "stop" : "start"}
        </button>
        <button onClick={() => {

          const rows = [];
          for (let index = 0; index < numRows; index++) {
            rows.push(Array.from(Array(numCols), () => (Math.random() > randomSparsity ? 1 : 0)))
          }
          setGrid(rows)
        }}> random</button>
        <button onClick={() => {
          setGrid(generateEmptyGrid());
          setRunning(false);
        }}>  clear </button>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
          {grid.map((rows, i) =>
            rows.map((col, j) =>
              <div
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][j] = grid[i][j] ? 0 : 1;
                  })
                  setGrid(newGrid);
                }}
                key={`${i}-${j}`}
                style={{
                  height: 20, width: 20, backgroundColor: grid[i][j] === 0 ? "white" : "tomato",
                  border: "solid 1px"
                }}></div>
            ))}
        </div>
      </div>
    </>
  )
}
export default App; 
