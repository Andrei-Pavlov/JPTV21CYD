import React from 'react'

export default function Services() {
    const [services, setServices] = React.useState([]);
    React.useEffect(() => {
        fetch(`https://my-json-server.typicode.com/Andrei-Pavlov/db_json/ProfessionDetail`)
        .then((res) => {
            return res.json();
        })
        .then((arr) => {
            setServices(arr);
        });
    }, []);
 
}
