import { Link } from 'react-router-dom';
import SavingsCalculator from '../components/SavingsCalculator';

const FEATURES = [
  { title: 'Receipts in a photo', text: 'Employees snap a receipt; amount, date and merchant are filled in for them.' },
  { title: 'Approvals in one click', text: 'Managers approve or send back a report from their phone.' },
  { title: 'Ready for accounting', text: 'Approved reports export to your accounting tool every month.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Expense reports without the paperwork</h1>
        <p>Spendlane automates expense reports for small and mid-sized companies.</p>
        <Link to="/demo" className="button">
          Book a demo
        </Link>
      </section>
      <SavingsCalculator />
      <section className="features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="card">
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
