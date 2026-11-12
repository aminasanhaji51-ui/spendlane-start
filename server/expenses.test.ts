import { readFile } from 'node:fs/promises';
import type pg from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createPool } from './db';
import { createExpenseRepository } from './expenses';

let pool: pg.Pool;

beforeAll(async () => {
  pool = createPool();
  const migration = await readFile(new URL('./migrations/001_create_expenses.sql', import.meta.url), 'utf8');
  await pool.query('drop table if exists expenses');
  await pool.query(migration);
});

beforeEach(async () => {
  await pool.query('truncate expenses restart identity');
});

afterAll(async () => {
  await pool.end();
});

describe('expense repository', () => {
  it('stores a submitted expense and lists it for its employee only', async () => {
    const expenses = createExpenseRepository(pool);
    await expenses.submit({ employeeEmail: 'lea@northwind.io', amountCents: 4250, category: 'meals' });
    await expenses.submit({ employeeEmail: 'karim@northwind.io', amountCents: 12000, category: 'travel' });

    const lea = await expenses.listFor('lea@northwind.io');
    expect(lea).toEqual([
      { id: 1, employeeEmail: 'lea@northwind.io', amountCents: 4250, category: 'meals', status: 'submitted' },
    ]);
  });

  it('refuses an amount of zero or less', async () => {
    const expenses = createExpenseRepository(pool);
    await expect(
      expenses.submit({ employeeEmail: 'lea@northwind.io', amountCents: 0, category: 'meals' }),
    ).rejects.toThrow('The amount must be a positive number of cents.');
  });

  it('approves a submitted expense once', async () => {
    const expenses = createExpenseRepository(pool);
    const expense = await expenses.submit({ employeeEmail: 'lea@northwind.io', amountCents: 4250, category: 'meals' });

    expect((await expenses.approve(expense.id)).status).toBe('approved');
    await expect(expenses.approve(expense.id)).rejects.toThrow(`Expense ${expense.id} is not waiting for approval.`);
  });
});
