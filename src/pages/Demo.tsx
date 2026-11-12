import { useState, type FormEvent } from 'react';
import { salesCalendarUrl, validateDemoForm, type DemoErrors, type DemoForm } from '../lib/demo';

const EMPTY_FORM: DemoForm = { fullName: '', email: '', companySize: '' };

export default function Demo() {
  const [form, setForm] = useState<DemoForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<DemoErrors>({});
  const [sent, setSent] = useState(false);
  const calendar = salesCalendarUrl();

  function update(field: keyof DemoForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateDemoForm(form);
    setErrors(found);
    setSent(Object.keys(found).length === 0);
  }

  if (sent) {
    return (
      <section className="card confirmation">
        <h1>Thank you</h1>
        <p>Our team will contact you within one business day.</p>
        {calendar && (
          <p>
            In a hurry? <a href={calendar}>Pick a slot in our calendar</a>.
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="card demo">
      <h1>Book a demo</h1>
      <form onSubmit={submit} noValidate>
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <label htmlFor="email">Work email</label>
        <input id="email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="companySize">Company size</label>
        <select id="companySize" value={form.companySize} onChange={(event) => update('companySize', event.target.value)}>
          <option value="">Choose</option>
          <option value="1-10">1 to 10 employees</option>
          <option value="11-50">11 to 50 employees</option>
          <option value="51-250">51 to 250 employees</option>
          <option value="251+">More than 250 employees</option>
        </select>
        {errors.companySize && <p className="error">{errors.companySize}</p>}

        <button type="submit" className="button">
          Book my demo
        </button>
      </form>
    </section>
  );
}
