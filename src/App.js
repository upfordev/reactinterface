import { BiCalendar } from 'react-icons/bi'
import { useState, useEffect, useCallback } from 'react'
import Search from './components/Search'
import AddAppointment from './components/AddApointment'
import AppointmentInfo from './components/AppointmentInfo'


function App() {
  let [appointmentList, setAppointmentList] = useState([])
  let [ query, setQuery ] = useState('')
  let [sortBy, setSortBy] = useState('petName')
  let [orderBy, setOrderBy] = useState('asc')

  const filteredAppointments = appointmentList.filter( item => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a,b) => {
    let order = (orderBy === 'asc') ? 1 : -1
    return (
      a[sortBy].toLowerCase() <
      b[sortBy].toLowerCase() ?
      -1 * order : order
    )
  })

  const fetchData = useCallback(async () => {
    const response = await fetch('./data.json')
    const data = await response.json()
    setAppointmentList(data)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top"/>Your Appointments</h1>
      <AddAppointment
        onSendAppointment={apt => setAppointmentList([...appointmentList, apt])}
        lastId={appointmentList.reduce((max, apt) => {
          if (Number(apt.id) > max) {
            max = Number(apt.id)
          }
          return max
        }, 0)}
      />
      <Search
        query={query}
        onQueryChange={q => setQuery(q)}
        orderBy={orderBy}
        onOrderByChange={order => setOrderBy(order)}
        sortBy={sortBy}
        onSortByChange={sort => setSortBy(sort)}
      />

      <ul className='divide-y divide-gray-200'>
        {filteredAppointments.map(appointment => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={
              appointmentId => {
                setAppointmentList(appointmentList.filter(
                  appointment => appointment.id !== appointmentId
                ))
              }
            }
          />
        ))}
      </ul>

    </div>
  );
}

export default App;
