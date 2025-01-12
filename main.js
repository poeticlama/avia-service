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
    const racesContainer = document.querySelector('.races');
    const notFound = document.querySelector('.not-found');

    racesContainer.innerHTML = '';

    if (tickets.length === 0) {
        notFound.style.display = 'block';
        return;
    }

    notFound.style.display = 'none';

    tickets.forEach((ticket) => {
        const ticketElement = document.createElement('div');
        ticketElement.classList.add('race');

        ticketElement.innerHTML = `
            <div class="head">
                <h1>${ticket.price} ${ticket.currency}</h1>
                <img src="https://via.placeholder.com/100x50?text=${ticket.airline}" alt="Airline logo">
            </div>
            <div class="race-info">
                <div class="route">
                    <label>${ticket.from} - ${ticket.to}</label>
                    <label>${ticket.departure_time} - ${ticket.return_time || 'N/A'}</label>
                </div>
                <div class="time">
                    <label>В пути:</label>
                    <label>${ticket.departure_date || 'N/A'}</label>
                </div>
                <div class="transfer">
                    <label>Рейс:</label>
                    <label>${ticket.flight_number || 'N/A'}</label>
                </div>
            </div>
        `;

        racesContainer.appendChild(ticketElement);
    });
};

document.getElementById('cheapest').addEventListener('click', async () => {
    const from = document.querySelector('.city-from input').value.trim();
    const to = document.querySelector('.city-to input').value.trim();

    if (!from || !to) {
        alert('Пожалуйста, введите города отправления и назначения.');
        return;
    }

    try {
        const tickets = await findTickets(from, to);
        showTickets(tickets);
    } catch (error) {
        console.error('Ошибка при обработке:', error);
        alert('Не удалось загрузить билеты. Попробуйте позже.');
    }
});
