import React from 'react';
import Shop from '../components/Shop';

const ShopPage = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
                <p className="text-gray-400">Spend your hard-earned gold on items and rewards.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <Shop />
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
