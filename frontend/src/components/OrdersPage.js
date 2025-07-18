import React, { useEffect, useState } from 'react';
import './OrdersPage.css';
import ParticlesBackground from '../components/ParticlesBackground';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [filter, setFilter] = useState({ name: '', date: '' });
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Ошибка загрузки товаров');
            const data = await res.json();

            const productsArray = Array.isArray(data) ? data : data.products || [];
            const productsMap = {};
            productsArray.forEach(p => { productsMap[p.id] = p; });
            setProducts(productsMap);
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить товары');
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            setError(null);
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Ошибка загрузки заказов');
            const data = await res.json();

            const normalizedOrders = data.map(order => ({
                ...order,
                items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
            }));

            setOrders(normalizedOrders);
        } catch (err) {
            console.error('Ошибка при загрузке заказов:', err);
            setError(err.message);
        } finally {
            setLoadingOrders(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesName = order.customer_name.toLowerCase().includes(filter.name.toLowerCase());
        const matchesDate = filter.date ? order.created_at.startsWith(filter.date) : true;
        return matchesName && matchesDate;
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            alert('Нет заказов для экспорта');
            return;
        }

        const headers = ['ID Заказа', 'Имя клиента', 'Телефон', 'Адрес', 'Товаров', 'Итог (₽)', 'Дата', 'Товары (название - кол-во - цена)'];

        const rows = filteredOrders.map(order => {
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const itemsStr = order.items.map(item => {
                const name = products[item.product_id]?.name || `ID ${item.product_id}`;
                return `${name} (${item.quantity} шт., ${parseFloat(item.price).toLocaleString('ru-RU')} ₽)`;
            }).join('; ');

            return [
                order.id,
                order.customer_name,
                order.phone,
                order.address,
                totalItems,
                parseFloat(order.total).toLocaleString('ru-RU'),
                new Date(order.created_at).toLocaleString(),
                `"${itemsStr}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    if (loadingOrders || loadingProducts) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (orders.length === 0) return <div className="noOrders">Заказы отсутствуют</div>;

    return (
        <>
            <ParticlesBackground>
                <main className="orders-container">
                    <h1 className="title">Мои заказы</h1>

                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Фильтр по имени"
                            value={filter.name}
                            onChange={e => setFilter(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            type="date"
                            value={filter.date}
                            onChange={e => setFilter(prev => ({ ...prev, date: e.target.value }))}
                        />
                        <button className="refreshBtn" onClick={() => { fetchProducts(); fetchOrders(); }}>
                            🔄
                        </button>
                        <button className="exportBtn" onClick={exportToCSV} style={{ marginLeft: '10px' }}>
                            📥 Экспорт в CSV
                        </button>
                    </div>

                    {filteredOrders.length === 0 && <div>Заказы не найдены</div>}

                    {currentOrders.map(order => {
                        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                        return (
                            <section key={order.id} className="card">
                                <header className="orderHeader">
                                    <h2 className="orderTitle">Заказ #{order.id}</h2>
                                    <span className="orderDate" title={new Date(order.created_at).toLocaleString()}>
                                        📅 {new Date(order.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                </header>

                                <div className="orderDetails">
                                    <div className="customerInfo">
                                        <p><strong>👤 Клиент:</strong> {order.customer_name}</p>
                                        <p><strong>📞 Телефон:</strong> {order.phone}</p>
                                        <p><strong>🏠 Адрес:</strong> {order.address}</p>
                                    </div>
                                    <div className="summaryInfo">
                                        <p><strong>🛒 Товаров:</strong> <span className="highlight">{totalItems}</span></p>
                                        <p><strong>💰 Итог:</strong> <span className="highlight">{parseFloat(order.total).toLocaleString('ru-RU')} ₽</span></p>
                                    </div>
                                </div>

                                <details className="itemsDetails" open>
                                    <summary>📦 Состав заказа</summary>
                                    <ul className="itemsList">
                                        {order.items.map(item => (
                                            <li key={item.product_id} className="item">
                                                <span className="itemName">{products[item.product_id]?.name || `ID ${item.product_id}`}</span>
                                                <span>× <b>{item.quantity}</b></span>
                                                <span className="itemPrice">{parseFloat(item.price).toLocaleString('ru-RU')} ₽</span>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </section>
                        );
                    })}

                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Назад</button>
                        <span> Страница {currentPage} из {Math.ceil(filteredOrders.length / ordersPerPage)} </span>
                        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}>Вперёд</button>
                    </div>
                </main>
            </ParticlesBackground>
        </>
    );
}

export default OrdersPage;
