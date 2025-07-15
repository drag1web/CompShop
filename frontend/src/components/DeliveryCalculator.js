import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import CheckoutPage from './CheckoutPage.css';

// Тариф и минимальная стоимость
const RATE_PER_KM = 0.8;
const MIN_DELIVERY = 100;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export default function DeliveryCalculator({ address, onCostCalculated }) {
    const [distance, setDistance] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState(MIN_DELIVERY);
    const [displayCost, setDisplayCost] = useState(MIN_DELIVERY); // Для анимации цифр
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const rafRef = useRef(null);

    const animateCost = (from, to, duration = 600) => {
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = from + (to - from) * progress;
            setDisplayCost(current);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(step);
            }
        };

        rafRef.current = requestAnimationFrame(step);
    };

    const apply = useCallback((dist) => {
        console.log('Расстояние:', dist);
        const cost = Math.max(MIN_DELIVERY, dist * RATE_PER_KM);
        console.log('Стоимость доставки:', cost);
        setDistance(dist);
        setDeliveryCost(cost);
        onCostCalculated(cost);

        // Запускаем анимацию от текущего отображаемого значения к новому
        animateCost(displayCost, cost);
    }, [onCostCalculated, displayCost]);

    useEffect(() => {
        if (!address || address.trim().length < 5) {
            setDistance(null);
            setDeliveryCost(MIN_DELIVERY);
            onCostCalculated(MIN_DELIVERY);
            animateCost(displayCost, MIN_DELIVERY);
            return;
        }

        const cached = localStorage.getItem(address);
        if (cached) {
            const dist = JSON.parse(cached);
            apply(dist);
            return;
        }

        setLoading(true);
        setError(null);

        const key = process.env.REACT_APP_YANDEX_API_KEY;
        if (!key) {
            setError('API ключ не установлен');
            setLoading(false);
            return;
        }

        const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/`;

        axios.get(geocodeUrl, {
            params: {
                apikey: key,
                geocode: address,
                format: 'json',
            }
        }).then(res => {
            const featureMember = res.data.response.GeoObjectCollection.featureMember[0];
            if (!featureMember) {
                throw new Error('Адрес не найден');
            }
            const posStr = featureMember.GeoObject.Point.pos; // "долгота широта"
            const [lng, lat] = posStr.split(' ').map(Number);

            const originCoords = [57.996353, 56.239028]; // Склад

            const dist = getDistanceFromLatLonInKm(originCoords[0], originCoords[1], lat, lng);

            localStorage.setItem(address, JSON.stringify(dist));
            apply(dist);
        }).catch(e => {
            setError(e.message || 'Ошибка при получении данных');
            setDistance(null);
            setDeliveryCost(MIN_DELIVERY);
            onCostCalculated(MIN_DELIVERY);
            animateCost(displayCost, MIN_DELIVERY);
        }).finally(() => setLoading(false));

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [address, apply, onCostCalculated]);

    return (
        <div className="delivery-calculator">
            {loading && <p>Расчёт доставки...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && distance !== null && (
                <p>
                    Расстояние: {distance.toFixed(1)} км, стоимость доставки: {' '}
                    <span className="delivery-cost-highlight">{displayCost.toFixed(2)} ₽</span>
                </p>
            )}
            {!loading && !error && distance === null && (
                <p>Введите адрес для расчёта доставки</p>
            )}
        </div>
    );
}
