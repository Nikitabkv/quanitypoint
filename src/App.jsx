import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { read, utils} from "xlsx";
import {useEffect, useState} from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [pres, setPres] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {(async() => {
    if (!file) return
    const arrbuffer = await file.arrayBuffer()
    const workBook = read(arrbuffer)
    const workSheet = workBook.Sheets[workBook.SheetNames[0]]
    const data= utils.sheet_to_json(workSheet)
    setPres(data)
  })()
  }, [file])

  const readClickHandler = () => {
    const result = {};
    let currentFio = '';
    pres.forEach(item => {
      if (item.hasOwnProperty("ФИО")) {
        const fio = item["ФИО"]
        currentFio = fio;
        result[fio] = {
          name: fio,
          salary: item["ЗП"],
        };
      } else {
        result[currentFio].salary += item["ЗП"];
      }
    });

    setResult(result)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {file && (
          <button onClick={() => readClickHandler()}>
            Посчитать отпускные
          </button>
        )}
        <input type={'file'} onInput={(e) => setFile(e.target.files[0])}/>
        {result && (
          <tbody>
          <tr>
            <th>ФИО</th>
            <th>Отпускные</th>
          </tr>
          {Object.entries(result).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{(value.salary / 12).toFixed(2)} р.</td>
            </tr>
          ))}
          </tbody>
        )}
      </div>
    </>
  )
}

export default App
