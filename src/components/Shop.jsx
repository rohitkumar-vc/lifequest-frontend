import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import { useAuth } from '../context/AuthProvider';
import { ShoppingBag, Shield, Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './ui/Modal';
import { useToast } from './ui/Toast';

const Shop = () => {
    const { shopItems, buyItem, deleteShopItem } = useGame();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isBuying, setIsBuying] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleBuyClick = (item) => {
        setSelectedItem(item);
    };

    const confirmPurchase = async () => {
        if (!selectedItem) return;
        setIsBuying(true);
        try {
            await buyItem(selectedItem.id);
            addToast(`Successfully bought ${selectedItem.name}!`, 'success');
            setSelectedItem(null);
        } catch (e) {
            addToast(e.response?.data?.detail || "Could not buy item", 'error');
        } finally {
            setIsBuying(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
    }

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await deleteShopItem(itemToDelete.id);
            addToast("Item deleted", "success");
            setItemToDelete(null);
        } catch (e) {
            addToast("Failed to delete item", "error");
        } finally {
            setIsDeleting(false);
        }
    }

    const items = Array.isArray(shopItems) ? shopItems : [];

    return (
        <div className="bg-card-dark border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                 <ShoppingBag className="w-6 h-6 text-amber-400" />
                 <h2 className="text-xl font-bold text-white">Merchant</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.length > 0 ? items.map((item) => (
                    <motion.div 
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col items-center text-center group hover:bg-white/10 transition-colors relative"
                    >
                        {user && user.role === 'admin' && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all p-1"
                                title="Delete Item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                            {item.effect_type === 'hp_restore' ? <Heart className="text-white w-6 h-6" /> : <Shield className="text-white w-6 h-6" />}
                        </div>
                        <h3 className="font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-4">{item.description}</p>
                        
                        <button 
                            onClick={() => handleBuyClick(item)}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-sm transition-colors"
                        >
                            {item.cost} Gold
                        </button>
                    </motion.div>
                )) : (
                    <div className="col-span-3 text-center text-gray-500 py-8">
                        Store is empty. Come back later!
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title="Confirm Purchase"
            >
                {selectedItem && (
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                                {selectedItem.effect_type === 'hp_restore' ? <Heart className="text-white w-8 h-8" /> : <Shield className="text-white w-8 h-8" />}
                            </div>
                            <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                            <p className="text-gray-400 mt-2">{selectedItem.description}</p>
                            <p className="text-amber-400 font-bold text-lg mt-2">{selectedItem.cost} Gold</p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPurchase}
                                disabled={isBuying}
                                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors disabled:opacity-50"
                            >
                                {isBuying ? 'Buying...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="Delete Item"
            >
                {itemToDelete && (
                    <div className="text-center">
                        <div className="mb-6">
                             <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-3 text-red-500">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <p className="text-gray-300">
                                Are you sure you want to delete <span className="font-bold text-white">{itemToDelete.name}</span>?
                            </p>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Shop;
