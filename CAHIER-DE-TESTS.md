# Cahier de tests – Spendlane

Source : code de `spendlane-start` (`src/lib/savings.ts`, `src/lib/demo.ts`, `src/components/*`, `src/pages/Demo.tsx`, `server/expenses.ts`, migration SQL).
Les résultats attendus sont calculés à la main à partir des règles du code (12 min/rapport à la main, 2 min avec Spendlane → 10 min gagnées par rapport ; heures = employés × rapports × 10 / 60, arrondi à 0,1).

Message d'erreur calculateur : `Enter 1 to 5000 employees and 1 to 30 reports per employee.`

## 1. Calculateur d'économies (page d'accueil)

| ID | Description | Input | Output attendu |
| --- | --- | --- | --- |
| CALC-01 | Valeurs par défaut | Page ouverte, aucune saisie (50 / 4) | `33.3 hours saved per month` |
| CALC-02 | Cas nominal | 50 employés, 4 rapports | `33.3 hours saved per month` |
| CALC-03 | Borne basse | 1 employé, 1 rapport | `0.2 hours saved per month` (10/60 = 0,167) |
| CALC-04 | Borne haute | 5000 employés, 30 rapports | `25000 hours saved per month` |
| CALC-05 | Résultat entier exact | 1 employé, 30 rapports | `5 hours saved per month` |
| CALC-06 | Arrondi à la baisse | 5000 employés, 1 rapport | `833.3 hours saved per month` |
| CALC-07 | Arrondi à la hausse | 7 employés, 1 rapport | `1.2 hours saved per month` (1,1667) |
| CALC-08 | Résultat exact à 1 décimale | 3 employés, 1 rapport | `0.5 hours saved per month` |
| CALC-09 | Espaces autour de la valeur | " 12 " employés, 4 rapports | `8 hours saved per month` |
| CALC-10 | Employés vides | "" employés, 4 rapports | Message d'erreur |
| CALC-11 | Rapports vides | 50 employés, "" rapports | Message d'erreur |
| CALC-12 | Employés = 0 | 0 employé, 4 rapports | Message d'erreur |
| CALC-13 | Rapports = 0 | 50 employés, 0 rapport | Message d'erreur |
| CALC-14 | Employés au-dessus du max | 5001 employés, 4 rapports | Message d'erreur |
| CALC-15 | Rapports au-dessus du max | 50 employés, 31 rapports | Message d'erreur |
| CALC-16 | Valeur négative | -3 employés, 4 rapports | Message d'erreur |
| CALC-17 | Valeur décimale | 4.5 employés, 4 rapports | Message d'erreur |
| CALC-18 | Notation scientifique | "1e2" employés, 4 rapports | Message d'erreur |
| CALC-19 | Texte non numérique | "abc" (si le navigateur laisse passer) | Message d'erreur |
| CALC-20 | Mise à jour en direct | Passer de 50 à 100 employés (4 rapports) | `66.7 hours saved per month` |
| CALC-21 | Retour de l'erreur au résultat | Saisir 0 puis corriger en 10 (4 rapports) | Message d'erreur puis `6.7 hours saved per month` |
| CALC-22 | Texte d'aide | Page ouverte | `12 minutes per report by hand, 2 minutes with Spendlane.` |

### Tests unitaires `parseCount(value, max)`

| ID | Input | Output attendu |
| --- | --- | --- |
| PC-01 | `("1", 5000)` | `1` |
| PC-02 | `("5000", 5000)` | `5000` |
| PC-03 | `("5001", 5000)` | `null` |
| PC-04 | `("0", 5000)` | `null` |
| PC-05 | `("", 5000)` | `null` |
| PC-06 | `("  ", 5000)` | `null` |
| PC-07 | `(" 12 ", 5000)` | `12` |
| PC-08 | `("-1", 5000)` | `null` |
| PC-09 | `("1.5", 5000)` | `null` |
| PC-10 | `("007", 5000)` | `7` |
| PC-11 | `("30", 30)` / `("31", 30)` | `30` / `null` |

### Tests unitaires `hoursSavedPerMonth(employees, reports)`

| ID | Input | Output attendu |
| --- | --- | --- |
| HS-01 | `(50, 4)` | `33.3` |
| HS-02 | `(1, 1)` | `0.2` |
| HS-03 | `(5000, 30)` | `25000` |
| HS-04 | `(6, 1)` | `1` |
| HS-05 | `(1, 30)` | `5` |

## 2. Formulaire « Book a demo » (`/demo`)

Précondition : `/demo` ouverte, formulaire vide.

| ID | Description | Input (nom, email, taille) | Output attendu |
| --- | --- | --- | --- |
| DEMO-01 | Soumission valide | Karim Haddad, karim@northwind.io, 11 to 50 | Page `Thank you` + `Our team will contact you within one business day.` |
| DEMO-02 | Formulaire vide | "", "", (Choose) | `Enter your full name.`, `Enter a valid work email.`, `Choose your company size.` ; pas de page de remerciement |
| DEMO-03 | Nom vide | "", karim@northwind.io, 11 to 50 | `Enter your full name.` sous le nom ; pas de remerciement |
| DEMO-04 | Nom d'un seul caractère | "K", karim@northwind.io, 11 to 50 | `Enter your full name.` |
| DEMO-05 | Nom de 2 caractères (limite) | "Al", karim@northwind.io, 11 to 50 | Page `Thank you` |
| DEMO-06 | Nom en espaces seulement | "   ", karim@northwind.io, 11 to 50 | `Enter your full name.` |
| DEMO-07 | Email incomplet | Karim Haddad, "karim@", 11 to 50 | `Enter a valid work email.` sous l'email |
| DEMO-08 | Email sans @ | Karim Haddad, "karim.northwind.io", 11 to 50 | `Enter a valid work email.` |
| DEMO-09 | Email sans domaine après le point | Karim Haddad, "karim@northwind", 11 to 50 | `Enter a valid work email.` |
| DEMO-10 | Email avec espace interne | Karim Haddad, "ka rim@northwind.io", 11 to 50 | `Enter a valid work email.` |
| DEMO-11 | Email avec espaces autour | Karim Haddad, " karim@northwind.io ", 11 to 50 | Page `Thank you` (trim) |
| DEMO-12 | Email vide | Karim Haddad, "", 11 to 50 | `Enter a valid work email.` |
| DEMO-13 | Taille non choisie ⚠️ | Karim Haddad, karim@northwind.io, (Choose) | `Choose your company size.` sous le champ, pas de remerciement. **Défaut connu : le code actuel ne valide pas `companySize` → le test ÉCHOUE (affiche `Thank you`).** |
| DEMO-14 | Chaque taille acceptée | Karim Haddad, karim@northwind.io, 1-10 / 11-50 / 51-250 / 251+ | Page `Thank you` pour chacune |
| DEMO-15 | Plusieurs erreurs | "", "karim@", 11 to 50 | Deux messages d'erreur (nom + email) |
| DEMO-16 | Correction après erreur | Soumettre vide, puis remplir correctement | Erreurs disparaissent, page `Thank you` |
| DEMO-17 | Lien calendrier présent | Soumission valide, `VITE_SALES_CALENDAR_URL=https://cal.example.com/x` | Lien `Pick a slot in our calendar` vers cette URL |
| DEMO-18 | Lien calendrier absent | Soumission valide, variable non définie | Pas de lien calendrier |

### Tests unitaires `validateDemoForm(form)`

| ID | Input | Output attendu |
| --- | --- | --- |
| VF-01 | `{fullName:"Karim Haddad", email:"karim@northwind.io", companySize:"11-50"}` | `{}` |
| VF-02 | `{fullName:"K", email:"karim@northwind.io", companySize:"11-50"}` | `{fullName:"Enter your full name."}` |
| VF-03 | `{fullName:"Karim", email:"karim@", companySize:"11-50"}` | `{email:"Enter a valid work email."}` |
| VF-04 | `{fullName:"", email:"", companySize:"11-50"}` | erreurs `fullName` et `email` |
| VF-05 | `{fullName:"Karim", email:"karim@northwind.io", companySize:""}` ⚠️ | `{companySize:"Choose your company size."}` (**échoue actuellement : retourne `{}`**) |

### Tests unitaires `salesCalendarUrl(value)`

| ID | Input | Output attendu |
| --- | --- | --- |
| SC-01 | `"https://cal.example.com/x"` | `"https://cal.example.com/x"` |
| SC-02 | `"http://cal.example.com/x"` | `null` |
| SC-03 | `""` | `null` |
| SC-04 | `undefined` | `null` |
| SC-05 | `"cal.example.com"` | `null` |

## 3. Bandeau d'environnement

| ID | Input (`VITE_APP_ENV`) | Output attendu |
| --- | --- | --- |
| ENV-01 | non définie | Aucun bandeau |
| ENV-02 | `production` | Aucun bandeau |
| ENV-03 | `staging` | Bandeau `Staging environment: this is not the live Spendlane site.` (role `status`) |
| ENV-04 | `preview` | Bandeau `Preview environment: this is not the live Spendlane site.` |
| ENV-05 | `""` | Aucun bandeau |

## 4. Dépôt de notes de frais (`server/expenses.ts`, PostgreSQL)

Précondition : table `expenses` créée via la migration `001_create_expenses.sql`, vide.

| ID | Fonction | Input | Output attendu |
| --- | --- | --- | --- |
| EXP-01 | `submit` | `{employeeEmail:"a@x.io", amountCents:1250, category:"meals"}` | Note créée : `id` entier, mêmes champs, `status:"submitted"` |
| EXP-02 | `submit` | `amountCents: 1` (borne basse) | Note créée, `status:"submitted"` |
| EXP-03 | `submit` | `amountCents: 0` | Erreur `The amount must be a positive number of cents.` ; rien en base |
| EXP-04 | `submit` | `amountCents: -500` | Même erreur |
| EXP-05 | `submit` | `amountCents: 12.5` | Même erreur |
| EXP-06 | `submit` | `amountCents: NaN` | Même erreur |
| EXP-07 | `submit` | catégorie `"travel"`, `"equipment"`, `"other"` | Note créée pour chacune |
| EXP-08 | `submit` | catégorie invalide `"gifts"` (contournement du typage) | Erreur base (contrainte `check` sur `category`) |
| EXP-09 | `submit` | Deux soumissions successives | `id` différents et croissants |
| EXP-10 | `listFor` | `"a@x.io"` avec 2 notes de a@x.io et 1 de b@x.io | 2 notes, de a@x.io uniquement, triées par `id` croissant |
| EXP-11 | `listFor` | Email sans note | `[]` |
| EXP-12 | `listFor` | Email avec casse différente `"A@X.IO"` | `[]` (comparaison sensible à la casse) |
| EXP-13 | `approve` | `id` d'une note `submitted` | Note retournée avec `status:"approved"` |
| EXP-14 | `approve` | `id` d'une note déjà `approved` | Erreur `Expense <id> is not waiting for approval.` |
| EXP-15 | `approve` | `id` d'une note `rejected` | Même erreur ; statut inchangé |
| EXP-16 | `approve` | `id` inexistant (ex. 9999) | Erreur `Expense 9999 is not waiting for approval.` |
| EXP-17 | `approve` puis `listFor` | Approuver puis lister | La note apparaît avec `status:"approved"` |

## 5. Responsive et interface

| ID | Description | Input | Output attendu |
| --- | --- | --- | --- |
| UI-01 | Mobile – accueil | Largeur 375 px | Pas de défilement horizontal, champs et boutons accessibles |
| UI-02 | Mobile – `/demo` | Largeur 375 px | Pas de défilement horizontal, formulaire utilisable |
| UI-03 | Accessibilité des libellés | Cliquer sur le libellé « Employees », « Full name », etc. | Le champ associé prend le focus |
| UI-04 | Navigation | Aller sur `/` puis `/demo` | Chaque page s'affiche sans erreur console |

## Synthèse

- Total : 22 + 11 + 5 (calculateur) · 18 + 5 + 5 (démo) · 5 (bandeau) · 17 (dépôt) · 4 (UI).
- **Défaut identifié à la lecture du code** : `validateDemoForm` ne vérifie pas `companySize` (DEMO-13, VF-05). Le message `Choose your company size.` n'existe pas dans le code.
- Question ouverte : le nom doit-il avoir une longueur maximale ? (aucune limite actuellement.)
