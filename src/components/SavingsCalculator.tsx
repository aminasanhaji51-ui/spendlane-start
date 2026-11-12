import { useState } from 'react';
import { MAX_EMPLOYEES, MAX_REPORTS_PER_EMPLOYEE, hoursSavedPerMonth, parseCount } from '../lib/savings';

export default function SavingsCalculator() {
  const [employeesValue, setEmployeesValue] = useState('50');
  const [reportsValue, setReportsValue] = useState('4');
  const employees = parseCount(employeesValue, MAX_EMPLOYEES);
  const reports = parseCount(reportsValue, MAX_REPORTS_PER_EMPLOYEE);

  return (
    <section className="card calculator" aria-labelledby="calculator-title">
      <h2 id="calculator-title">How much time could you save?</h2>
      <label htmlFor="employees">Employees</label>
      <input id="employees" type="number" value={employeesValue} onChange={(event) => setEmployeesValue(event.target.value)} />
      <label htmlFor="reports">Expense reports per employee per month</label>
      <input id="reports" type="number" value={reportsValue} onChange={(event) => setReportsValue(event.target.value)} />
      {employees === null || reports === null ? (
        <p className="result error">
          Enter 1 to {MAX_EMPLOYEES} employees and 1 to {MAX_REPORTS_PER_EMPLOYEE} reports per employee.
        </p>
      ) : (
        <p className="result">
          <strong>{hoursSavedPerMonth(employees, reports)}</strong> hours saved per month
        </p>
      )}
      <p className="hint">12 minutes per report by hand, 2 minutes with Spendlane.</p>
    </section>
  );
}
