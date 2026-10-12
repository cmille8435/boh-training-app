Sign-in adds verified email/password accounts to both training apps. Supabase determines each app role; users cannot select a role or claim another team member's name.

Leaders can edit training and photos, view/update every saved progress record in their assigned app, link sign-in emails to existing training names, and delete team members after confirmation. Team members can browse training and read only the progress record linked to their verified email. Their training progress is read-only.

Activation is pending the project administrator's Supabase setup. Run the private setup SQL containing the approved roster, enable Email authentication and Confirm Email, configure an SMTP sender for production email delivery, and allow these callback URLs:

- https://cmille8435.github.io/boh-training-app/
- https://cmille8435.github.io/boh-training-app/foh/

Then deploy this branch immediately. The SQL locks down anonymous access, so the old app cannot access saved data after it runs. Do not run it until the app deployment is ready. The migration preserves existing training rows and records existing policies in a table accessible only to the database administrator. The public migration intentionally excludes personal email addresses. Use the user's private setup file for the roster.

Create/confirm the first approved leader account, sign in, and open Team Members. Link each person's exact existing training name and sign-in email. They can then create/confirm an account and view their own progress. Names and links do not send invitations or create Supabase Auth users. New unlinked accounts receive no saved progress.

Validation: npm install --prefix tests && npm test --prefix tests. The tests run an isolated PostgreSQL-compatible database and DOM simulation: own-progress isolation, scoped leader access, member edit denial, role escalation denial, unauthenticated and unconfirmed-account denial, migration rerun, and both app role views. Live Supabase and device validation remain pending activation.

Only the six designated access administrators can promote a linked team member to a leader using Give Leader Access in Team Members. Promotion is scoped to the current app and does not grant access-administrator permissions. The private setup seeds this administrator list.
