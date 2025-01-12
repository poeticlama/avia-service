const API_KEY = '321d6a221f8926b5ec41ae89a3b2ae7b';
const API_URL = 'https://api.travelpayouts.com/v1/prices/cheap';

const findTickets = async (from, to) => {
    let tickets = [];

    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
        const queryDate = new Date(currentDate);
        queryDate.setDate(currentDate.getDate() + i);
        const startDate = queryDate.toISOString().split('T')[0];

        const url = `${API_URL}?origin=${from}&destination=${to}&currency=rub&token=${API_KEY}&departure_at=${startDate}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.data && data.data[to]) {
            for (const key in data.data[to]) {
                if (data.data[to].hasOwnProperty(key)) {
                    const ticketData = data.data[to][key];

                    const ticket = {
                        price: ticketData.price,
                        departure_time: ticketData.departure_at,
                        return_time: ticketData.return_at,
                        expires_at: ticketData.expires_at,
                        flight_number: ticketData.flight_number,
                        airline: ticketData.airline,
                        currency: data.currency,
                        from: from,
                        to: to,
                        departure_date: startDate,
                    };

                    tickets.push(ticket);
                }
            }
        }
    }

    console.log(tickets);
    return tickets;
}


const showTickets = (tickets) => {
    if (tickets.length === 0) {
        const races = document.getElementsByClassName('races');
        races.style.display = 'none';
        const notFound = document.getElementsByClassName('not-found');
        notFound.style.display = 'block';
        return;
    }
    const notFound = document.getElementsByClassName('not-found');
    notFound.style.display = 'none';
    for (let ticket of tickets) {

    }
}

findTickets("LED", "KZN")