import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Select, Space } from 'antd';
import './App.css';



function App() {
  const [stock, setStock] = useState([])
  const [data, setData] = useState();
  const [modelOptions, setModelOptions] = useState([])
  const [selectedModels, setSelectedModels] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      sorter: false,
    },
    {
      title: 'Марка/модель',
      // dataIndex: 'mark',
      render: (record) => `${record.mark} ${record.model}`,
      sorter: false,
    },
    {
      title: 'Модификация',
      render: (record) => `${record.engine.volume.toFixed(1)} ${record.engine.transmission} (${record.engine.power} л.с.) ${record.drive}`,
      sorter: false,
    },
    {
      title: 'Комплектация',
      dataIndex: 'equipmentName',
      sorter: false,
    },
    {
      title: 'Стоимость',
      dataIndex: 'price',
      render: (record) => {
        return `${record.toLocaleString('ru-RU')} ₽`
      },
      sorter: false,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      render: (record) => {
        const date = new Date(record)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`
      },
      sorter: false,
    },
  ]
  async function loadStock() {
    setLoading(true);
    const response = await axios.get('/api')
    setStock(response.data)
    setData(response.data.all)
    setModelOptions(getUniqueModel(response.data.all))
    setLoading(false);
  }

  useEffect(() => {
    loadStock()
  },[])

  function handleFilter (e) {
    e.preventDefault 
    const result = stock.all.filter((el) => el.mark === e.target.text)
    setData(result)
    setModelOptions(getUniqueModel(result))
    setSelectedModels([]);
  }

  function getUniqueModel(tableData) {
    const options = tableData?.map((el) => el.model).filter(el => el != null);
    const unique = [...new Set (options)]
    const res = unique.map((el) => ({'label': el, 'value': el}))
    return res
  }

  function handleFilterModel(values) {
    if (values.length === 0) {
      setData(stock.all)
      setSelectedModels([]);
      return 
    }
    const res = stock.all?.filter((el) =>  values.includes(el.model))
    setSelectedModels(values);
    setData(res)
  }

  function handleTableChange(pagination) {
    setTableParams({
      ...tableParams,
      pagination,
    });
    loadStock(pagination);
  }


  return (
    <>
      {stock.agregated 
        ? (stock.agregated.map((el) => <span key={el._id}><a href='#' onClick ={(e) => handleFilter(e)}>{el._id}</a> { el.totalItems } </span> ))
        : ''
      }
      <Select
      mode="multiple"
      allowClear
      style={{
        width: '20%',
      }}
      placeholder="Выберете модель"
      onChange={handleFilterModel}
      options={modelOptions}
      value={selectedModels}
    />

          <Table
      columns={columns}
      rowKey={(record) => record._id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
    </>
  )
}

export default App
