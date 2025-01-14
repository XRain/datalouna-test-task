import bcrypt from 'bcrypt';
import pool from '../db';

export async function createUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, balance) VALUES ($1, $2, 1000) RETURNING id, username, balance',
      [username, passwordHash]
    );
    console.log('User created: ', result.rows[0]?.username);
    return result.rows[0];
  } catch (error) {
    console.log('User creation failed', error);
  }
}

export async function authenticateUser(username: string, password: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  
  const user = result.rows[0];
  if (!user) return null;
  
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) return null;
  
  console.log('User signed in', user.username);
  return {
    id: user.id,
    username: user.username,
    balance: user.balance
  };
}

export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  
  if (!user.rows[0]) throw new Error('User not found');
  
  const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password_hash);
  if (!validPassword) throw new Error('Invalid password');
  
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [newPasswordHash, userId]
  );
  
  console.log('Password changed for user', user.rows[0].username);
  return true;
}

export async function updateBalance(userId: number, amount: number) {
  const result = await pool.query(
    'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
    [amount, userId]
  );
  
  return result.rows[0];
} 