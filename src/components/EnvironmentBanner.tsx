export default function EnvironmentBanner() {
  const environment = import.meta.env.VITE_APP_ENV;
  if (!environment || environment === 'production') {
    return null;
  }
  const label = environment.charAt(0).toUpperCase() + environment.slice(1);
  return (
    <p className="environment-banner" role="status">
      {label} environment: this is not the live Spendlane site.
    </p>
  );
}
