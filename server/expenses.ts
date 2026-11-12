import type pg from 'pg';

export type Category = 'travel' | 'meals' | 'equipment' | 'other';
export type Status = 'submitted' | 'approved' | 'rejected';

export type Expense = {
  id: number;
  employeeEmail: string;
  amountCents: number;
  category: Category;
  status: Status;
};

export type NewExpense = Pick<Expense, 'employeeEmail' | 'amountCents' | 'category'>;

type ExpenseRow = {
  id: number;
  employee_email: string;
  amount_cents: number;
  category: Category;
  status: Status;
};

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    employeeEmail: row.employee_email,
    amountCents: row.amount_cents,
    category: row.category,
    status: row.status,
  };
}

export function createExpenseRepository(pool: pg.Pool) {
  return {
    async submit(expense: NewExpense): Promise<Expense> {
      if (!Number.isInteger(expense.amountCents) || expense.amountCents <= 0) {
        throw new Error('The amount must be a positive number of cents.');
      }
      const { rows } = await pool.query<ExpenseRow>(
        `insert into expenses (employee_email, amount_cents, category)
         values ($1, $2, $3)
         returning id, employee_email, amount_cents, category, status`,
        [expense.employeeEmail, expense.amountCents, expense.category],
      );
      return toExpense(rows[0]);
    },

    async listFor(employeeEmail: string): Promise<Expense[]> {
      const { rows } = await pool.query<ExpenseRow>(
        `select id, employee_email, amount_cents, category, status
         from expenses where employee_email = $1 order by id`,
        [employeeEmail],
      );
      return rows.map(toExpense);
    },

    async approve(id: number): Promise<Expense> {
      const { rows } = await pool.query<ExpenseRow>(
        `update expenses set status = 'approved'
         where id = $1 and status = 'submitted'
         returning id, employee_email, amount_cents, category, status`,
        [id],
      );
      if (rows.length === 0) {
        throw new Error(`Expense ${id} is not waiting for approval.`);
      }
      return toExpense(rows[0]);
    },
  };
}
