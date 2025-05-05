    import { useState } from 'react';

    const equipmentData = [
        {
            name: "Лижі",
            price: 500,
            category: "ski",
            image: "https://sportano.ua/img/986c30c27a3d26a3ee16c136f92f4ff5/1/9/195751613422_40-jpg/girs-ki-lizhi-salomon-s-max-4-kriplennja-m10-gw-bili-bezpechni-zhovti-chorni-1235557.jpg"
        },
        {
            name: "Сноуборд",
            price: 600,
            category: "ski",
            image: "https://northwall.com.ua/published/publicdata/DB1/attachments/SC/products_pictures/stratosqy.jpg"
        },
        {
            name: "Сноуборд дитячий",
            price: 500,
            category: "ski",
            image: "https://shop.wakepark.by/image/cache/catalog/luckyboo/snoubord-luckyboo-%E2%80%93-snow-monster-cherno-zheltyi%CC%86-800x800.jpg"
        },
        {
            name: "Велосипед",
            price: 400,
            category: "bike",
            image: "https://velopodium.com.ua/content/images/40/536x335l50nn0/velosiped-formula-motion-dd-27.5-73877134576820.jpg"
        },
        {
            name: "Велосипед дитячий",
            price: 400,
            category: "bike",
            image: "https://images.prom.ua/4287812947_w600_h600_4287812947.jpg"
        },
        {
            name: "Жіноча куртка",
            price: 400,
            category: "clothes",
            image: "https://cdn.4f.com.pl/media/catalog/product/cache/b6003fe37ea5e56d4b26f0099314aec5/4/F/4FWAW24TTJAF593-11S-M-03-MAIN.jpg"
        },
        {
            name: "Чоловіча куртка",
            price: 400,
            category: "clothes",
            image: "https://content2.rozetka.com.ua/goods/images/big/484737005.jpg"
        },
        {
            name: "Дитяча куртка",
            price: 400,
            category: "clothes",
            image: "https://content.rozetka.com.ua/goods/images/big/286177354.jpg"
        }
    ];

    export default function Equipment({ onRent }) {
    const [filter, setFilter] = useState('all');

    const filteredItems = filter === 'all'
        ? equipmentData
        : equipmentData.filter(item => item.category === filter);

    return (
        <section id="equipment">
        <h2>Оберіть обладнання</h2>
        <div className="filter-buttons">
            <button onClick={() => setFilter('all')}>Усі</button>
            <button onClick={() => setFilter('ski')}>Лижне спорядження</button>
            <button onClick={() => setFilter('bike')}>Велоспорт</button>
            <button onClick={() => setFilter('clothes')}>Одяг</button>
        </div>

        <div className="grid">
            {filteredItems.map((item, index) => {
            const today = new Date().toISOString().split("T")[0];
            return (
                <div key={index} className={`item ${item.category}`}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Ціна: {item.price} грн/день</p>
                <label>Початок: <input type="date" className="start-date" min={today} /></label>
                <label>Кінець: <input type="date" className="end-date" min={today} /></label>
                <button className="rent-btn" onClick={(e) => {
                    const start = e.target.parentElement.querySelector(".start-date").value;
                    const end = e.target.parentElement.querySelector(".end-date").value;

                    if (!start || !end) {
                    alert("Будь ласка, виберіть дату оренди.");
                    return;
                    }

                    onRent({
                    ...item,
                    startDate: start,
                    endDate: end
                    });

                    e.target.textContent = "✅ Додано";
                    e.target.disabled = true;
                    e.target.style.backgroundColor = "#28a745";
                }}>Орендувати</button>
                </div>
            );
            })}
        </div>
        </section>
    );
    }
