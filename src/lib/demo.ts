export type DemoForm = {
  fullName: string;
  email: string;
  companySize: string;
};

export type DemoErrors = Partial<Record<keyof DemoForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COMPANY_SIZES = ['1-10', '11-50', '51-250', '251+'];

export function validateDemoForm(form: DemoForm): DemoErrors {
  const errors: DemoErrors = {};
  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.';
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid work email.';
  }
  if (!COMPANY_SIZES.includes(form.companySize)) {
    errors.companySize = 'Choose your company size.';
  }
  return errors;
}

export function salesCalendarUrl(value: string | undefined = import.meta.env.VITE_SALES_CALENDAR_URL): string | null {
  return value && value.startsWith('https://') ? value : null;
}
