"use client";

import { LegalShell } from "@/components/layout/LegalShell";
import { useT } from "@/lib/i18n";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl font-semibold text-default mt-2">{children}</h2>;
}

export default function PrivacyPage() {
  const { locale } = useT();
  const nl = locale === "nl";

  return (
    <LegalShell
      title={nl ? "Privacybeleid" : "Privacy Policy"}
      lastUpdated={nl ? "Laatst bijgewerkt: 8 juni 2026" : "Last updated: 8 June 2026"}
    >
      {nl ? (
        <>
          <p>
            Dit privacybeleid legt uit welke persoonsgegevens Ready to Ace verzamelt, waarom, en
            welke rechten je hebt onder de Algemene Verordening Gegevensbescherming (AVG).
          </p>

          <H2>1. Welke gegevens we verzamelen</H2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Accountgegevens:</strong> naam, e-mailadres en versleuteld wachtwoord.</li>
            <li><strong>Profiel:</strong> je doelrol, sector, doelbedrijf en niveau (optioneel).</li>
            <li><strong>Gebruiksgegevens:</strong> testresultaten, scores en voortgang.</li>
            <li><strong>Betaalgegevens:</strong> abonnementsstatus. Kaartgegevens worden door LemonSqueezy verwerkt. Wij slaan ze nooit op.</li>
          </ul>

          <H2>2. Waarom we deze gegevens verwerken</H2>
          <p>
            We gebruiken je gegevens om de Dienst te leveren (account, tests, gepersonaliseerde
            aanbevelingen), om betalingen te verwerken, om je te informeren over je account
            (zoals e-mailverificatie en wachtwoordherstel), en om de Dienst te beveiligen en te
            verbeteren. De rechtsgrond is de uitvoering van onze overeenkomst met jou en ons
            gerechtvaardigd belang bij een veilige, werkende dienst.
          </p>

          <H2>3. Subverwerkers</H2>
          <p>We delen gegevens met de volgende verwerkers, uitsluitend om de Dienst te leveren:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Neon</strong>: databasehosting (EU, Frankfurt)</li>
            <li><strong>Fly.io</strong>: backend-hosting</li>
            <li><strong>Vercel</strong>: frontend-hosting</li>
            <li><strong>LemonSqueezy</strong>: betalingsverwerking</li>
            <li><strong>Resend</strong>: transactionele e-mails</li>
            <li><strong>Anthropic</strong>: AI-testgeneratie (geen persoonsgegevens van gebruikers)</li>
            <li><strong>Sentry</strong>: foutmonitoring</li>
          </ul>

          <H2>4. Bewaartermijn</H2>
          <p>
            We bewaren je gegevens zolang je account actief is. Wanneer je je account verwijdert,
            wissen we je profiel, testresultaten en bijbehorende gegevens definitief.
          </p>

          <H2>5. Cookies</H2>
          <p>
            We gebruiken één strikt noodzakelijk cookie: een beveiligde httpOnly-cookie die je
            sessie in stand houdt (refresh-token). Omdat dit cookie noodzakelijk is om in te
            kunnen loggen, is er geen toestemmingsbanner vereist. We gebruiken geen
            tracking- of advertentiecookies.
          </p>

          <H2>6. Jouw rechten</H2>
          <p>Onder de AVG heb je het recht op:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Inzage en export:</strong> download al je gegevens via Instellingen.</li>
            <li><strong>Verwijdering:</strong> verwijder je account en alle gegevens via Instellingen.</li>
            <li><strong>Rectificatie:</strong> pas je profielgegevens aan in de app.</li>
            <li><strong>Bezwaar/klacht:</strong> je kunt een klacht indienen bij de bevoegde toezichthouder.</li>
          </ul>

          <H2>7. Contact</H2>
          <p>Vragen over je gegevens? Neem contact op via support@ready-to-ace.com.</p>
        </>
      ) : (
        <>
          <p>
            This Privacy Policy explains what personal data Ready to Ace collects, why, and what
            rights you have under the General Data Protection Regulation (GDPR).
          </p>

          <H2>1. Data we collect</H2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Account data:</strong> name, email address and an encrypted password.</li>
            <li><strong>Profile:</strong> your target role, industry, target company and level (optional).</li>
            <li><strong>Usage data:</strong> test results, scores and progress.</li>
            <li><strong>Payment data:</strong> subscription status. Card details are handled by LemonSqueezy. We never store them.</li>
          </ul>

          <H2>2. Why we process this data</H2>
          <p>
            We use your data to provide the Service (account, tests, personalized
            recommendations), to process payments, to communicate about your account (such as
            email verification and password recovery), and to secure and improve the Service.
            The legal basis is the performance of our contract with you and our legitimate
            interest in a secure, functioning service.
          </p>

          <H2>3. Subprocessors</H2>
          <p>We share data with the following processors, solely to operate the Service:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Neon</strong>: database hosting (EU, Frankfurt)</li>
            <li><strong>Fly.io</strong>: backend hosting</li>
            <li><strong>Vercel</strong>: frontend hosting</li>
            <li><strong>LemonSqueezy</strong>: payment processing</li>
            <li><strong>Resend</strong>: transactional email</li>
            <li><strong>Anthropic</strong>: AI test generation (no user personal data)</li>
            <li><strong>Sentry</strong>: error monitoring</li>
          </ul>

          <H2>4. Retention</H2>
          <p>
            We retain your data for as long as your account is active. When you delete your
            account, we permanently erase your profile, test results and associated data.
          </p>

          <H2>5. Cookies</H2>
          <p>
            We use a single strictly necessary cookie: a secure httpOnly cookie that maintains
            your session (refresh token). Because this cookie is required to log in, no consent
            banner is needed. We use no tracking or advertising cookies.
          </p>

          <H2>6. Your rights</H2>
          <p>Under the GDPR you have the right to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Access and export:</strong> download all your data from Settings.</li>
            <li><strong>Erasure:</strong> delete your account and all data from Settings.</li>
            <li><strong>Rectification:</strong> update your profile data in the app.</li>
            <li><strong>Objection/complaint:</strong> you may lodge a complaint with your supervisory authority.</li>
          </ul>

          <H2>7. Contact</H2>
          <p>Questions about your data? Contact us at support@ready-to-ace.com.</p>
        </>
      )}
    </LegalShell>
  );
}
