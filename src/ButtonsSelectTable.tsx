import react from 'react';

function ButtonsSelectTable({setTableSelected}) {
  function handleTableSelected(event) {
    setTableSelected(event.id);
  }
  return (
    <div className="space-x-4 p-12">
      <button id='tanStackTable' className="right-20 top-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10" onClick={(e) => handleTableSelected(e.target)}>
        Tanstack Table
      </button>
      <button id='oneMillionTable' className="right-20 top-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10" onClick={(e) => handleTableSelected(e.target)}>
        Tanstack-OneMillion Table
      </button>
    </div>
  );
}

export default ButtonsSelectTable;