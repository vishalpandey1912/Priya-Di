'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'bundle' | 'subject' | 'chapter' | 'material' | 'test_series';
    targetIds: string[]; // IDs of content this product unlocks (e.g. 'physics', 'chapter-123')
    features: string[]; // For display in pricing cards
    isActive: boolean;
    isRecommended?: boolean;
    color?: string; // Hex code for UI styling
    image?: string;
}

// Initial default products to maintain backward compatibility
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: 'full-year',
        name: 'NEET 2026 Full Course',
        description: 'Complete access to Physics, Chemistry, and Biology',
        price: 14999,
        type: 'bundle',
        targetIds: ['full_bundle', 'physics', 'chemistry', 'biology'],
        features: ['All 3 Subjects', 'Live Classes', 'Physical Study Material', 'Personal Mentor', 'Doubt Support'],
        isActive: true,
        isRecommended: true,
        color: '#00A99D'
    },
    {
        id: 'crash-course',
        name: 'Physics Crash Course',
        description: 'Complete Physics in 60 Days',
        price: 2499,
        type: 'subject',
        targetIds: ['physics'],
        features: ['Complete Physics in 60 Days', 'Formula Sheets', 'Daily Practice Problems', 'Previous Year Questions'],
        isActive: true,
        color: '#FF5722'
    },
    {
        id: 'test-series',
        name: 'All India Test Series',
        description: 'Comprehensive Mock Tests for NEET',
        price: 999,
        type: 'test_series',
        targetIds: ['test_series'],
        features: ['50+ Mock Tests', 'AIR Prediction', 'Detailed Analytics', 'Video Solutions'],
        isActive: true,
        color: '#FFC107'
    }
];

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProductByTarget: (targetId: string) => Product | undefined; // Find cheaper/specific product for a target
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('siteProducts');
        if (saved) {
            try {
                setProducts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse products", e);
                setProducts(DEFAULT_PRODUCTS);
            }
        } else {
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem('siteProducts', JSON.stringify(DEFAULT_PRODUCTS));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('siteProducts', JSON.stringify(products));
        }
    }, [products, isLoaded]);

    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const getProductByTarget = (targetId: string) => {
        // Find a product that specifically targets this ID (priority to single items over bundles usually, or cheapest?)
        // Let's return the first active one found for now.
        return products.find(p => p.isActive && p.targetIds.includes(targetId));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductByTarget }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};
