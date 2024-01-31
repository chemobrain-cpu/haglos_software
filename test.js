let data = [
    {
      client_name: 'JOHN GREEN',
      client_phone_numbers: '09071991647',
      rider_name_no: 'paul halman',
      chasis_no: '098',
      vehicle_reg_no: '0puitg56',
      tracker_sim_no: '2345',
      tracker_id: 'OIUYTR',
      installation_date: '2023-02-09',
      expiring_date: '2023-01-26',
      __v: 0
    },
    {
      client_name: 'ERIK PAUL',
      client_phone_numbers: '09087667745',
      rider_name_no: '1234',
      chasis_no: '12WER',
      vehicle_reg_no: 'REG1090UC',
      tracker_sim_no: 'WYC-4',
      tracker_id: 'H1U2YU4',
      installation_date: '2023-01-26',
      expiring_date: '2023-02-09',
      __v: 0
    },
    {
      client_name: 'MESSI .10',
      client_phone_numbers: '0908877654',
      rider_name_no: 'WILLY',
      chasis_no: 'RTY',
      vehicle_reg_no: '123W-10',
      tracker_sim_no: '09087',
      tracker_id: 'WERT',
      installation_date: '2023-02-10',
      expiring_date: '2023-01-16',
      __v: 0
    },
    {
      client_name: 'PAUL WALKER',
      client_phone_numbers: '0902080818',
      rider_name_no: 'URST',
      chasis_no: 'POIURT',
      vehicle_reg_no: 'ERYUT',
      tracker_sim_no: 'QWERT',
      tracker_id: '1234EDR',
      installation_date: '2023-02-10',
      expiring_date: '2023-01-28',
      __v: 0
    },
    {
        client_name: 'PAUL WALKER',
        client_phone_numbers: '0902080818',
        rider_name_no: 'URST',
        chasis_no: 'POIURT',
        vehicle_reg_no: 'ERYUT',
        tracker_sim_no: 'QWERT',
        tracker_id: '1234EDR',
        installation_date: '2023-02-10',
        expiring_date: '2023-10-28',
        __v: 0
      },
      {
        client_name: 'PAUL WALKER',
        client_phone_numbers: '0902080818',
        rider_name_no: 'URST',
        chasis_no: 'POIURT',
        vehicle_reg_no: 'ERYUT',
        tracker_sim_no: 'QWERT',
        tracker_id: '1234EDR',
        installation_date: '2023-02-10',
        expiring_date: '1997-01-28',
        __v: 0
      },
      {
        client_name: 'PAUL WALKER',
        client_phone_numbers: '0902080818',
        rider_name_no: 'URST',
        chasis_no: 'POIURT',
        vehicle_reg_no: 'ERYUT',
        tracker_sim_no: 'QWERT',
        tracker_id: '1234EDR',
        installation_date: '2023-02-10',
        expiring_date: '2023-01-31',
        __v: 0
      }
]


  //sorting algorithms
  let sortByYear = (obj)=>{
    return obj.sort((a,b)=>{
        expiry = new Date(a.expiring_date)
        expiry2 = new Date(b.expiring_date)
        return expiry - expiry2
    })
  }
 


/*
  client_name
  client_phone_numbers
  rider_name_no
  chasis_no
  vehicle_reg_no
  tracker_sim_no
  tracker_id
  installation_date
  expiring_date

  */

  console.log(sortByYear(data))