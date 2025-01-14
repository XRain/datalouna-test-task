import axios from 'axios';
import redis from '../redis';
import { SkinportItem } from '../types';
import pool from '../db';

const CACHE_EXPIRATION = 300; // 5 minutes

export async function getSkinportItems(): Promise<SkinportItem[]> {
  const cachedItems = await redis.get('skinport_items');
  
  if (cachedItems) {
    return JSON.parse(cachedItems);
  }
  
  // Get non-tradable items
  const nonTradableResponse = await axios.get('https://api.skinport.com/v1/items', {
    params: {
      app_id: 730,
      currency: 'EUR',
      tradable: 0
    },
    headers: {
      'Accept-Encoding': 'br'
    }
  });

  // Get tradable items
  const tradableResponse = await axios.get('https://api.skinport.com/v1/items', {
    params: {
      app_id: 730,
      currency: 'EUR',
      tradable: 1
    },
    headers: {
      'Accept-Encoding': 'br'
    }
  });

  // Create a map of tradable items with their min prices
  const tradablePricesMap = new Map(
    tradableResponse.data.map((item: SkinportItem) => [
      item.market_hash_name,
      item.min_price
    ])
  );

  // Add tradable_min_price to non-tradable items
  const updatedItems = nonTradableResponse.data.map((item: SkinportItem) => ({
    ...item,
    tradable_min_price: tradablePricesMap.get(item.market_hash_name) || null
  }));
  
  await redis.setex('skinport_items', CACHE_EXPIRATION, JSON.stringify(updatedItems));
  
  return updatedItems;
}

export async function purchaseItem(userId: number, itemId: number) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const itemResult = await client.query(
      'SELECT * FROM items WHERE id = $1 AND quantity > 0',
      [itemId]
    );
    
    if (!itemResult.rows[0]) {
      throw new Error('Item not available');
    }
    
    const item = itemResult.rows[0];
    
    const userResult = await client.query(
      'SELECT balance FROM users WHERE id = $1',
      [userId]
    );
    
    if (!userResult.rows[0] || userResult.rows[0].balance < item.price) {
      throw new Error('Insufficient balance');
    }
    
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [item.price, userId]
    );
    
    await client.query(
      'UPDATE items SET quantity = quantity - 1 WHERE id = $1',
      [itemId]
    );
    
    await client.query(
      'INSERT INTO purchases (user_id, item_id, price) VALUES ($1, $2, $3)',
      [userId, itemId, item.price]
    );
    
    await client.query('COMMIT');
    
    return {
      success: true,
      newBalance: userResult.rows[0].balance - item.price
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getCustomItems() {
  const result = await pool.query(
    'SELECT * FROM items WHERE quantity > 0 ORDER BY price ASC'
  );
  return result.rows;
} 