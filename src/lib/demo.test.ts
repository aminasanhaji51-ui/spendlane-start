import { describe, expect, it } from 'vitest';
import { salesCalendarUrl, validateDemoForm } from './demo';

describe('validateDemoForm', () => {
  it('accepts a complete form', () => {
    expect(validateDemoForm({ fullName: 'Karim Haddad', email: 'karim@northwind.io', companySize: '11-50' })).toEqual({});
  });

  it('refuses an email without a domain', () => {
    const errors = validateDemoForm({ fullName: 'Karim Haddad', email: 'karim@', companySize: '11-50' });
    expect(errors.email).toBe('Enter a valid work email.');
  });
});

describe('salesCalendarUrl', () => {
  it('keeps an https address', () => {
    expect(salesCalendarUrl('https://cal.example.com/spendlane-demo')).toBe('https://cal.example.com/spendlane-demo');
  });

  it('returns nothing when the variable is missing or not https', () => {
    expect(salesCalendarUrl(undefined)).toBeNull();
    expect(salesCalendarUrl('http://cal.example.com')).toBeNull();
  });
});
